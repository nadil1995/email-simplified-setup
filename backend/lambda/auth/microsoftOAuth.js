
const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken');

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    authority: 'https://login.microsoftonline.com/common'
  }
};

const msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Microsoft Graph permissions needed
const SCOPES = [
  'https://graph.microsoft.com/Directory.AccessAsUser.All',
  'https://graph.microsoft.com/User.ReadWrite.All'
];

exports.handler = async (event) => {
  try {
    if (event.path.includes('/callback')) {
      return handleCallback(event);
    }
    
    // Generate authorization URL
    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: SCOPES,
      redirectUri: `${process.env.API_BASE_URL}/auth/microsoft/callback`
    });

    return {
      statusCode: 302,
      headers: {
        Location: authUrl
      }
    };
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process Microsoft OAuth request' })
    };
  }
};

async function handleCallback(event) {
  try {
    const code = event.queryStringParameters.code;
    
    const result = await msalClient.acquireTokenByCode({
      code,
      scopes: SCOPES,
      redirectUri: `${process.env.API_BASE_URL}/auth/microsoft/callback`
    });
    
    // Store tokens securely
    await storeTokens(result);

    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.FRONTEND_URL}/platform-integration?provider=microsoft&status=success`
      }
    };
  } catch (error) {
    console.error('Microsoft OAuth callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.FRONTEND_URL}/platform-integration?provider=microsoft&status=error`
      }
    };
  }
}

async function storeTokens(tokens) {
  // Encrypt tokens before storing
  const encryptedTokens = jwt.sign(tokens, process.env.JWT_SECRET);
  
  // Store in DynamoDB
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: 'microsoft_graph_tokens',
      tokens: encryptedTokens,
      updatedAt: new Date().toISOString()
    }
  };
  
  await dynamoDb.put(params).promise();
}
