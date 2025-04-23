
const { google } = require('googleapis');
const { Client } = require('@microsoft/microsoft-graph-client');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    const { provider, domain, emailName, firstName, lastName, password } = JSON.parse(event.body);
    
    switch (provider.toLowerCase()) {
      case 'google':
        return await createGoogleAccount(domain, emailName, firstName, lastName, password);
      case 'microsoft':
        return await createMicrosoftAccount(domain, emailName, firstName, lastName, password);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unsupported provider' })
        };
    }
  } catch (error) {
    console.error('Error creating email account:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create email account' })
    };
  }
};

async function createGoogleAccount(domain, emailName, firstName, lastName, password) {
  // Get stored Google tokens
  const tokens = await getStoredTokens('google_workspace_tokens');
  
  const auth = new google.auth.OAuth2();
  auth.setCredentials(tokens);
  
  const admin = google.admin({ version: 'directory_v1', auth });
  
  try {
    const response = await admin.users.insert({
      requestBody: {
        primaryEmail: `${emailName}@${domain}`,
        name: {
          givenName: firstName,
          familyName: lastName
        },
        password: password,
        changePasswordAtNextLogin: true
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Google Workspace account created successfully',
        email: response.data.primaryEmail
      })
    };
  } catch (error) {
    console.error('Google account creation error:', error);
    throw error;
  }
}

async function createMicrosoftAccount(domain, emailName, firstName, lastName, password) {
  // Get stored Microsoft tokens
  const tokens = await getStoredTokens('microsoft_graph_tokens');
  
  const client = Client.init({
    authProvider: (done) => {
      done(null, tokens.accessToken);
    }
  });
  
  try {
    const response = await client.api('/users').post({
      accountEnabled: true,
      displayName: `${firstName} ${lastName}`,
      mailNickname: emailName,
      userPrincipalName: `${emailName}@${domain}`,
      passwordProfile: {
        password: password,
        forceChangePasswordNextSignIn: true
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Microsoft 365 account created successfully',
        email: response.userPrincipalName
      })
    };
  } catch (error) {
    console.error('Microsoft account creation error:', error);
    throw error;
  }
}

async function getStoredTokens(tokenId) {
  // Retrieve and decrypt tokens from DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: tokenId }
  };
  
  const result = await dynamoDb.get(params).promise();
  if (!result.Item) {
    throw new Error('Provider not connected');
  }
  
  return jwt.verify(result.Item.tokens, process.env.JWT_SECRET);
}
