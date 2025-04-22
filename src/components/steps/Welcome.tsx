
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Email Setup Simplified
      </h1>
      
      <p className="text-muted-foreground mb-8">
        Create a professional email like info@yourdomain.com in minutes. 
        No technical experience required.
      </p>
      
      <div className="space-y-4 mb-8">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm">1</div>
            <p className="text-sm font-medium">Enter your domain</p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm">2</div>
            <p className="text-sm font-medium">Choose your email provider</p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm">3</div>
            <p className="text-sm font-medium">We handle the technical setup</p>
          </div>
        </div>
      </div>
      
      <Button onClick={onNext} size="lg" className="w-full">
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;
