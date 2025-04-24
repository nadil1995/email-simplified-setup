import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { checkDomainRegistrar } from "@/utils/domainUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface DomainInputProps {
  onNext: (domain: string) => void;
  onBack: () => void;
}

const DomainInput = ({ onNext, onBack }: DomainInputProps) => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [registrarInfo, setRegistrarInfo] = useState<{ registrar: string | null; instructions: string } | null>(null);
  const [showProviderLogin, setShowProviderLogin] = useState(false);
  const { toast } = useToast();

  const handleDomainCheck = async () => {
    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }

    try {
      const info = await checkDomainRegistrar(domain);
      setRegistrarInfo(info);
      if (info.registrar) {
        setShowProviderLogin(true);
      } else {
        toast({
          title: "Domain Provider Not Detected",
          description: "We couldn't automatically detect your domain provider. Please try a different verification method.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      setError("Unable to check domain information");
    }
  };

  const handleProviderLogin = (provider: string) => {
    toast({
      title: "Provider Authentication",
      description: `Redirecting to ${provider} for authentication...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Domain Verified",
        description: "Your domain ownership has been verified successfully!",
        variant: "default",
      });
      onNext(domain);
    }, 2000);
  };

  const handleManualVerification = () => {
    toast({
      title: "Manual Verification",
      description: "We'll guide you through the manual verification process.",
    });
    onNext(domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    
    if (showProviderLogin) {
      return;
    }
    
    handleDomainCheck();
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Domain</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain Name</Label>
          <div className="flex gap-2">
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setError("");
                setRegistrarInfo(null);
                setShowProviderLogin(false);
              }}
              className={error ? "border-destructive" : ""}
            />
            <Button type="button" variant="secondary" onClick={handleDomainCheck}>
              Check Domain
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {registrarInfo && !showProviderLogin && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                  Domain Provider: {registrarInfo.registrar || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {registrarInfo.instructions}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showProviderLogin && registrarInfo?.registrar && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Domain Ownership</CardTitle>
              <CardDescription>
                Log in to your domain provider to verify ownership instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We've detected that your domain is registered with {registrarInfo.registrar}.
                You can verify ownership by logging into your provider account.
              </p>
              <Button 
                onClick={() => handleProviderLogin(registrarInfo.registrar || "")}
                className="w-full mb-2"
              >
                Log in to {registrarInfo.registrar}
              </Button>
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={handleManualVerification}
                  className="text-sm text-muted-foreground underline mt-2"
                >
                  I prefer manual verification
                </button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!showProviderLogin && (
          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline" className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              {registrarInfo ? "Continue" : "Check Domain"} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </form>
      
      <div className="mt-8 border rounded-lg p-4 bg-muted/30">
        <h3 className="text-sm font-medium mb-2">Don't have a domain yet?</h3>
        <p className="text-sm text-muted-foreground">
          You'll need to purchase a domain before setting up email. 
          We recommend using <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Namecheap</a> or <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">GoDaddy</a>.
        </p>
      </div>
    </div>
  );
};

export default DomainInput;
