
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface DomainInputProps {
  onNext: (domain: string) => void;
  onBack: () => void;
}

const DomainInput = ({ onNext, onBack }: DomainInputProps) => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple domain validation
    if (!domain) {
      setError("Please enter a domain name");
      return;
    }
    
    // Basic domain format validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }
    
    setError("");
    onNext(domain);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Domain</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain Name</Label>
          <Input
            id="domain"
            placeholder="example.com"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setError("");
            }}
            className={error ? "border-destructive" : ""}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            Enter the domain where you want to set up email.
          </p>
        </div>
        
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
          We recommend using <a href="#" className="text-primary underline">Namecheap</a> or <a href="#" className="text-primary underline">GoDaddy</a>.
        </p>
      </div>
    </div>
  );
};

export default DomainInput;
