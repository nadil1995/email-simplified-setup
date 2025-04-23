
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { domain, provider, emailName, addUsers } = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.claims.sub; // Get user ID from Cognito token
    
    const item = {
      id: `setup_${Date.now()}`,
      userId,
      domain,
      provider,
      emailName,
      addUsers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await dynamodb.put({
      TableName: process.env.EMAIL_SETUPS_TABLE,
      Item: item
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error creating email setup:', error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        error: error.message || 'Could not create email setup'
      })
    };
  }
};
