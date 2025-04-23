
import { whois } from './whoisClient';

export interface DomainInfo {
  registrar: string | null;
  nameservers: string[];
  instructions: string;
}

export const getRegistrarInstructions = (registrar: string): string => {
  const instructions: { [key: string]: string } = {
    'GoDaddy': 'Log in to GoDaddy.com → Open Domain Settings → Manage DNS → Add Records',
    'Namecheap': 'Log in to Namecheap.com → Domain List → Manage → Advanced DNS → Add Records',
    'Google Domains': 'Log in to domains.google.com → DNS → Manage Custom Records → Add Records',
    'Network Solutions': 'Log in to NetworkSolutions.com → Manage → Advanced DNS → Add Records',
  };
  
  return instructions[registrar] || 'Please check your domain registrar\'s documentation for DNS management instructions.';
};

export const checkDomainRegistrar = async (domain: string): Promise<DomainInfo> => {
  try {
    // In a real implementation, you would make a WHOIS lookup here
    // For now, we'll simulate the response
    const mockResponse = {
      registrar: domain.includes('godaddy') ? 'GoDaddy' : 
                 domain.includes('namecheap') ? 'Namecheap' : 
                 'Unknown Registrar',
      nameservers: ['ns1.example.com', 'ns2.example.com']
    };

    return {
      registrar: mockResponse.registrar,
      nameservers: mockResponse.nameservers,
      instructions: getRegistrarInstructions(mockResponse.registrar)
    };
  } catch (error) {
    console.error('Error checking domain registrar:', error);
    return {
      registrar: null,
      nameservers: [],
      instructions: 'Unable to detect domain registrar. Please check your domain provider\'s documentation.'
    };
  }
};
