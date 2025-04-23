
const Route53 = require('aws-sdk/clients/route53');
const route53 = new Route53();

const generateVerificationToken = () => {
  return 'verify-' + Math.random().toString(36).substring(2, 15);
};

exports.handler = async (event) => {
  try {
    const { domain } = JSON.parse(event.body);
    
    if (!domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain is required' })
      };
    }

    // Generate a unique verification token
    const verificationToken = generateVerificationToken();
    const verificationRecord = `lovable-verify=${verificationToken}`;

    // Create TXT record for domain verification
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: domain,
              Type: 'TXT',
              TTL: 300,
              ResourceRecords: [{ Value: `"${verificationRecord}"` }]
            }
          }
        ],
        Comment: 'Domain verification record'
      },
      HostedZoneId: process.env.ROUTE53_HOSTED_ZONE_ID // Will be set in AWS Console
    };

    // Add TXT record to Route53
    await route53.changeResourceRecordSets(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Verification record created',
        verificationToken,
        instructions: 'Please wait a few minutes for DNS propagation'
      })
    };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify domain' })
    };
  }
};
