
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// Initialize OAuth 2.0 client
const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.API_BASE_URL}/auth/google/callback`
});

// Google Workspace Admin SDK scopes needed
const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.domain'
];

exports.handler = async (event) => {
  try {
    if (event.path.includes('/callback')) {
      return handleCallback(event);
    }
    
    // Generate OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    return {
      statusCode: 302,
      headers: {
        Location: authUrl
      }
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process Google OAuth request' })
    };
  }
};

async function handleCallback(event) {
  try {
    const code = event.queryStringParameters.code;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens securely (in this case, encrypt and save to DynamoDB)
    await storeTokens(tokens);

    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.FRONTEND_URL}/platform-integration?provider=google&status=success`
      }
    };
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.FRONTEND_URL}/platform-integration?provider=google&status=error`
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
      id: 'google_workspace_tokens',
      tokens: encryptedTokens,
      updatedAt: new Date().toISOString()
    }
  };
  
  await dynamoDb.put(params).promise();
}
