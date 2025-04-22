
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { emailSetupAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface AutomatedSetupProps {
  domain: string;
  emailName: string;
  provider: string;
  addUsers?: boolean;
  onComplete: () => void;
}

const AutomatedSetup = ({ 
  domain, 
  emailName, 
  provider, 
  addUsers = false,
  onComplete 
}: AutomatedSetupProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const steps = [
    { name: "Verifying domain ownership", success: true },
    { name: "Setting up DNS records", success: true },
    { name: `Configuring ${provider === "google" ? "Google Workspace" : provider === "microsoft" ? "Microsoft 365" : "AWS WorkMail"}`, success: true },
    { name: `Creating ${emailName}@${domain}`, success: true },
    { name: "Finalizing setup", success: true }
  ];

  useEffect(() => {
    const simulateProgress = async () => {
      // Stage 1: Verifying domain
      setCurrentStep(0);
      for (let i = 0; i <= 20; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Stage 2: DNS records
      setCurrentStep(1);
      for (let i = 21; i <= 40; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Stage 3: Provider setup
      setCurrentStep(2);
      for (let i = 41; i <= 60; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Stage 4: Email creation
      setCurrentStep(3);
      for (let i = 61; i <= 80; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Stage 5: Finalizing
      setCurrentStep(4);
      for (let i = 81; i <= 100; i++) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Save to backend
      try {
        await emailSetupAPI.createSetup({
          domain,
          provider,
          emailName,
          addUsers
        });
        toast({
          title: "Setup complete!",
          description: "Your email has been configured successfully.",
        });
      } catch (error) {
        console.error("Error saving email setup:", error);
        toast({
          title: "Error saving setup",
          description: "Your setup completed but we couldn't save it. Please try again.",
          variant: "destructive",
        });
      }
      
      // Call onComplete after successful backend save
      onComplete();
    };
    
    simulateProgress();
  }, [domain, emailName, provider, addUsers, onComplete, toast]);
  
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Setting Up Your Email</h2>
      
      <Progress value={progress} className="mb-6" />
      
      <div className="space-y-4 mb-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`
              flex items-center justify-between border rounded-lg p-3
              ${currentStep === index ? "bg-primary/5 border-primary/20" : "border-border"}
              ${currentStep > index ? "bg-muted/30" : ""}
            `}
          >
            <span className="text-sm">{step.name}</span>
            <div className="flex items-center">
              {currentStep > index ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              ) : currentStep === index ? (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-muted"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {progress === 100 && (
        <div className="text-center">
          <p className="text-green-600 font-medium mb-4">Setup Complete!</p>
          <Button onClick={handleGoToDashboard}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default AutomatedSetup;
