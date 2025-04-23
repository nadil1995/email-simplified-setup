
const dns = require('dns');
const { promisify } = require('util');

const resolveTxt = promisify(dns.resolveTxt);

exports.handler = async (event) => {
  try {
    const { domain, verificationToken } = JSON.parse(event.body);
    
    if (!domain || !verificationToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Domain and verification token are required' })
      };
    }

    // Get TXT records for the domain
    const txtRecords = await resolveTxt(domain);
    const expectedRecord = `lovable-verify=${verificationToken}`;
    
    // Check if our verification record exists
    const isVerified = txtRecords.some(records => 
      records.some(record => record.includes(expectedRecord))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        verified: isVerified,
        message: isVerified ? 
          'Domain verified successfully' : 
          'Verification record not found or not propagated yet'
      })
    };
  } catch (error) {
    console.error('Error checking verification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check domain verification' })
    };
  }
};
