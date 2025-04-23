
/**
 * A simple mock WHOIS client.
 * In a production environment, this would make actual WHOIS requests or use a third-party API.
 */

export interface WhoisResponse {
  registrar: string | null;
  nameservers: string[];
  creationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
}

/**
 * Perform a mock WHOIS lookup for a domain
 * @param domain The domain to lookup
 * @returns WhoisResponse object with domain registration info
 */
export const whois = async (domain: string): Promise<WhoisResponse> => {
  console.log(`Mock WHOIS lookup for domain: ${domain}`);
  
  // In a real implementation, this would call an API or perform a WHOIS lookup
  // For now, we'll simulate different responses based on the domain name
  
  if (domain.includes('godaddy')) {
    return {
      registrar: 'GoDaddy',
      nameservers: ['ns1.godaddy.com', 'ns2.godaddy.com'],
      creationDate: '2020-01-01',
      expirationDate: '2025-01-01'
    };
  } else if (domain.includes('namecheap')) {
    return {
      registrar: 'Namecheap',
      nameservers: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com'],
      creationDate: '2019-05-15',
      expirationDate: '2024-05-15'
    };
  } else if (domain.includes('google')) {
    return {
      registrar: 'Google Domains',
      nameservers: ['ns1.googledomains.com', 'ns2.googledomains.com'],
      creationDate: '2018-11-30',
      expirationDate: '2024-11-30'
    };
  } else if (domain.includes('network') || domain.includes('solutions')) {
    return {
      registrar: 'Network Solutions',
      nameservers: ['ns1.networksolutions.com', 'ns2.networksolutions.com'],
      creationDate: '2017-08-22',
      expirationDate: '2025-08-22'
    };
  } else {
    // Default response for unknown domains
    return {
      registrar: null,
      nameservers: [],
      creationDate: undefined,
      expirationDate: undefined
    };
  }
};
