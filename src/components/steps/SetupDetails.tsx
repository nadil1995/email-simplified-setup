
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";

interface SetupDetailsProps {
  domain: string;
  provider: string;
  onNext: (emailName: string, addUsers: boolean) => void;
  onBack: () => void;
}

const SetupDetails = ({ domain, provider, onNext, onBack }: SetupDetailsProps) => {
  const [emailName, setEmailName] = useState("info");
  const [addUsers, setAddUsers] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailName) {
      setError("Please enter an email name");
      return;
    }
    
    // Basic validation for email local part
    const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    if (!localPartRegex.test(emailName)) {
      setError("Email name contains invalid characters");
      return;
    }
    
    setError("");
    onNext(emailName, addUsers);
  };

  const getProviderName = () => {
    switch (provider) {
      case "google":
        return "Gmail / Google Workspace";
      case "microsoft":
        return "Outlook / Microsoft 365";
      case "aws":
        return "Basic Webmail (AWS WorkMail)";
      default:
        return "Email Provider";
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Setup Details</h2>
      
      <div className="bg-muted/30 border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Domain:</span>
          <span className="text-sm">{domain}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium">Provider:</span>
          <span className="text-sm">{getProviderName()}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="emailName">Email Address</Label>
          <div className="flex">
            <Input
              id="emailName"
              placeholder="info"
              value={emailName}
              onChange={(e) => {
                setEmailName(e.target.value);
                setError("");
              }}
              className={`rounded-r-none ${error ? "border-destructive" : ""}`}
            />
            <div className="bg-muted px-3 flex items-center border border-l-0 rounded-r-md">
              @{domain}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            This will be your primary email address.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="addUsers">Add additional users?</Label>
            <p className="text-sm text-muted-foreground">
              Setup multiple email accounts
            </p>
          </div>
          <Switch
            id="addUsers"
            checked={addUsers}
            onCheckedChange={setAddUsers}
          />
        </div>
        
        {provider === "google" && (
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4">
            <p className="text-sm">
              <span className="font-medium">Note:</span> You'll need to sign in to your Google account 
              to complete setup. Google Workspace costs $6/user/month after a 14-day free trial.
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1 gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SetupDetails;
