
import { whois, WhoisResponse } from './whoisClient';

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
    // Use our whois client to get domain information
    const whoisResponse = await whois(domain);
    
    return {
      registrar: whoisResponse.registrar,
      nameservers: whoisResponse.nameservers,
      instructions: whoisResponse.registrar ? getRegistrarInstructions(whoisResponse.registrar) : 'Unable to detect domain registrar. Please check your domain provider\'s documentation.'
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
