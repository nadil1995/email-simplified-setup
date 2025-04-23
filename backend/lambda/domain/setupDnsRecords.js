
const Route53 = require('aws-sdk/clients/route53');
const route53 = new Route53();

exports.handler = async (event) => {
  try {
    const { domain, provider, hostedZoneId } = JSON.parse(event.body);
    
    if (!domain || !provider) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain and provider are required' })
      };
    }

    // Use provided hostedZoneId or get it from environment variables
    const zoneId = hostedZoneId || process.env.ROUTE53_HOSTED_ZONE_ID;
    
    if (!zoneId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No hosted zone ID provided or configured' })
      };
    }

    // Define DNS records based on email provider
    const dnsRecords = getDnsRecordsForProvider(domain, provider);
    
    // Prepare changes for Route53
    const params = {
      ChangeBatch: {
        Changes: dnsRecords.map(record => ({
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: record.name,
            Type: record.type,
            TTL: record.ttl || 3600,
            ResourceRecords: record.values.map(value => ({ Value: value }))
          }
        })),
        Comment: `Email DNS records for ${provider}`
      },
      HostedZoneId: zoneId
    };

    // Add records to Route53
    const result = await route53.changeResourceRecordSets(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'DNS records created successfully',
        changeInfo: result.ChangeInfo,
        recordsCreated: dnsRecords.length
      })
    };
  } catch (error) {
    console.error('Error setting up DNS records:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set up DNS records' })
    };
  }
};

// Helper function to get DNS records based on provider
function getDnsRecordsForProvider(domain, provider) {
  switch (provider.toLowerCase()) {
    case 'google':
      return getGoogleWorkspaceDnsRecords(domain);
    case 'microsoft':
      return getMicrosoftOfficeDnsRecords(domain);
    case 'aws':
      return getAwsWorkmailDnsRecords(domain);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

function getGoogleWorkspaceDnsRecords(domain) {
  return [
    // MX Records for Google Workspace
    {
      name: domain,
      type: 'MX',
      ttl: 3600,
      values: [
        '1 ASPMX.L.GOOGLE.COM.',
        '5 ALT1.ASPMX.L.GOOGLE.COM.',
        '5 ALT2.ASPMX.L.GOOGLE.COM.',
        '10 ALT3.ASPMX.L.GOOGLE.COM.',
        '10 ALT4.ASPMX.L.GOOGLE.COM.'
      ]
    },
    // SPF Record
    {
      name: domain,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=spf1 include:_spf.google.com ~all"']
    },
    // DKIM records (simplified - would need actual DKIM values from Google)
    {
      name: `google._domainkey.${domain}`,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."'] // Placeholder
    },
    // DMARC Record
    {
      name: `_dmarc.${domain}`,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@' + domain + '"']
    }
  ];
}

function getMicrosoftOfficeDnsRecords(domain) {
  return [
    // MX Records for Microsoft 365
    {
      name: domain,
      type: 'MX',
      ttl: 3600,
      values: ['0 ' + domain + '.mail.protection.outlook.com.']
    },
    // SPF Record
    {
      name: domain,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=spf1 include:spf.protection.outlook.com -all"']
    },
    // Autodiscover record
    {
      name: `autodiscover.${domain}`,
      type: 'CNAME',
      ttl: 3600,
      values: ['autodiscover.outlook.com.']
    },
    // DMARC Record
    {
      name: `_dmarc.${domain}`,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@' + domain + '"']
    }
    // DKIM records would be configured later in the Microsoft 365 admin portal
  ];
}

function getAwsWorkmailDnsRecords(domain) {
  const region = process.env.AWS_REGION || 'us-east-1';
  
  return [
    // MX Records for AWS WorkMail
    {
      name: domain,
      type: 'MX',
      ttl: 3600,
      values: [`10 inbound-smtp.${region}.amazonaws.com.`]
    },
    // SPF Record
    {
      name: domain,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=spf1 include:amazonses.com ~all"']
    },
    // Auto-discovery
    {
      name: `autodiscover.${domain}`,
      type: 'CNAME',
      ttl: 3600,
      values: [`autodiscover.mail.${region}.awsapps.com.`]
    },
    // DMARC Record
    {
      name: `_dmarc.${domain}`,
      type: 'TXT',
      ttl: 3600,
      values: ['"v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@' + domain + '"']
    }
    // DKIM records would be added automatically by AWS SES
  ];
}
