
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProviderCard from "../ProviderCard";
import { ArrowRight } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface ChooseProviderProps {
  onNext: (provider: string) => void;
  onBack: () => void;
}

const ChooseProvider = ({ onNext, onBack }: ChooseProviderProps) => {
  const [selectedProvider, setSelectedProvider] = useState<string>("google");
  
  const providers: Provider[] = [
    {
      id: "google",
      name: "Gmail / Google Workspace",
      description: "Professional email with Google's powerful tools and features.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
    },
    {
      id: "microsoft",
      name: "Outlook / Microsoft 365",
      description: "Business email powered by Microsoft with full Office integration.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    },
    {
      id: "aws",
      name: "Basic Webmail (AWS WorkMail)",
      description: "Simple and reliable email hosting through Amazon Web Services.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
    }
  ];

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Choose Email Platform</h2>
      <p className="text-center text-muted-foreground mb-6">
        Select the email service you'd like to use with your domain
      </p>
      
      <div className="space-y-4 mb-6">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            name={provider.name}
            description={provider.description}
            logo={provider.logo}
            selected={selectedProvider === provider.id}
            onClick={() => setSelectedProvider(provider.id)}
          />
        ))}
      </div>
      
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button 
          onClick={() => onNext(selectedProvider)} 
          className="flex-1 gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChooseProvider;
