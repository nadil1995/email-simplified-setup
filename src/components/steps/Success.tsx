
import { Button } from "@/components/ui/button";
import { Check, Globe, Mail, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessProps {
  domain: string;
  emailName: string;
  provider: string;
  onDashboard: () => void;
}

const Success = ({ domain, emailName, provider, onDashboard }: SuccessProps) => {
  const navigate = useNavigate();

  const getProviderName = () => {
    switch (provider) {
      case "google":
        return "Google Workspace";
      case "microsoft":
        return "Microsoft 365";
      case "aws":
        return "AWS WorkMail";
      default:
        return "Email Provider";
    }
  };

  const getProviderLoginUrl = () => {
    switch (provider) {
      case "google":
        return "https://admin.google.com";
      case "microsoft":
        return "https://admin.microsoft.com";
      case "aws":
        return "https://console.aws.amazon.com/workmail";
      default:
        return "#";
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground">
          Your email has been successfully configured.
        </p>
      </div>
      
      <div className="bg-muted/30 border rounded-lg p-4 mb-6 text-left">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Email Address</div>
            <div className="text-sm text-muted-foreground">{emailName}@{domain}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Provider</div>
            <div className="text-sm text-muted-foreground">{getProviderName()}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={handleGoToDashboard} className="w-full">
          Go to Dashboard
        </Button>
        
        <Button variant="outline" className="w-full gap-2" asChild>
          <a href={getProviderLoginUrl()} target="_blank" rel="noopener noreferrer">
            Open {getProviderName()} Admin <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        Need help? <a href="#" className="text-primary underline">Contact our support team</a>
      </div>
    </div>
  );
};

export default Success;
