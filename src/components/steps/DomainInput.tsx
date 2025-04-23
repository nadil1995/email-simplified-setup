
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { checkDomainRegistrar } from "@/utils/domainUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface DomainInputProps {
  onNext: (domain: string) => void;
  onBack: () => void;
}

const DomainInput = ({ onNext, onBack }: DomainInputProps) => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [registrarInfo, setRegistrarInfo] = useState<{ registrar: string | null; instructions: string } | null>(null);
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
      if (!info.registrar) {
        toast({
          title: "Domain Provider Not Detected",
          description: "We couldn't automatically detect your domain provider. You can still proceed with the setup.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      setError("Unable to check domain information");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    onNext(domain);
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
              }}
              className={error ? "border-destructive" : ""}
            />
            <Button type="button" variant="secondary" onClick={handleDomainCheck}>
              Check Domain
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {registrarInfo && (
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
        
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1 gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
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
