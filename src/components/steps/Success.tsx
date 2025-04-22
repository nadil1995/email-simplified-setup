
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessProps {
  domain: string;
  emailName: string;
  provider: string;
  onDashboard: () => void;
}

const Success = ({ domain, emailName, provider, onDashboard }: SuccessProps) => {
  const getProviderUrl = () => {
    switch (provider) {
      case "google":
        return "https://mail.google.com";
      case "microsoft":
        return "https://outlook.office.com";
      case "aws":
        return "https://mail.awsapps.com/mail";
      default:
        return "#";
    }
  };
  
  const getProviderName = () => {
    switch (provider) {
      case "google":
        return "Gmail";
      case "microsoft":
        return "Outlook";
      case "aws":
        return "AWS WorkMail";
      default:
        return "Email Provider";
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-8 w-8 text-brand-green" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Your Email is Ready!</h2>
      
      <p className="text-muted-foreground mb-6">
        Your new email address {emailName}@{domain} has been successfully configured 
        and is ready to use.
      </p>
      
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="font-medium mb-3">Email Account Details</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email Address:</span>
            <span className="text-sm font-medium">{emailName}@{domain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Provider:</span>
            <span className="text-sm font-medium">{getProviderName()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm font-medium text-brand-green flex items-center gap-1">
              <Check className="h-3 w-3" /> Active
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          className="w-full"
          onClick={() => window.open(getProviderUrl(), "_blank")}
        >
          Access Your Email
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onDashboard}
        >
          Go to Dashboard
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-6">
        Need help? <a href="#" className="text-primary underline">Contact support</a>
      </p>
    </div>
  );
};

export default Success;
