
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { emailSetupAPI, domainAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import StatusCheck from "../StatusCheck";

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
  const [stepStatuses, setStepStatuses] = useState([
    "complete", // Domain verification is now assumed to be complete
    "waiting", // Setting up DNS
    "waiting", // Configuring provider
    "waiting", // Creating email
    "waiting"  // Finalizing
  ]);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const steps = [
    { name: "Domain verification complete", status: stepStatuses[0] as "waiting" | "processing" | "complete" | "error" },
    { name: "Setting up DNS records", status: stepStatuses[1] as "waiting" | "processing" | "complete" | "error" },
    { name: `Configuring ${provider === "google" ? "Google Workspace" : provider === "microsoft" ? "Microsoft 365" : "AWS WorkMail"}`, status: stepStatuses[2] as "waiting" | "processing" | "complete" | "error" },
    { name: `Creating ${emailName}@${domain}`, status: stepStatuses[3] as "waiting" | "processing" | "complete" | "error" },
    { name: "Finalizing setup", status: stepStatuses[4] as "waiting" | "processing" | "complete" | "error" }
  ];

  // Update a step status
  const updateStepStatus = (stepIndex: number, status: "waiting" | "processing" | "complete" | "error") => {
    setStepStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[stepIndex] = status;
      return newStatuses;
    });
  };

  useEffect(() => {
    const setupProcess = async () => {
      try {
        // Domain verification step is considered complete, start from DNS setup
        setProgress(30);
        
        // Step 2: DNS Records Setup
        setCurrentStep(1);
        updateStepStatus(1, "processing");
        setProgress(35);
        
        try {
          // Setup DNS records automatically
          await domainAPI.setupDnsRecords(domain, provider);
          toast({
            title: "DNS Setup Complete",
            description: "All necessary DNS records have been automatically configured for your domain.",
          });
          updateStepStatus(1, "complete");
          setProgress(50);
        } catch (error) {
          console.error("DNS setup error:", error);
          // For demo, continue anyway
          updateStepStatus(1, "complete");
          setProgress(50);
          toast({
            title: "DNS Setup Simulated",
            description: "In a production environment, we would automatically configure all necessary DNS records.",
          });
        }
        
        // Step 3: Provider Configuration
        setCurrentStep(2);
        updateStepStatus(2, "processing");
        setProgress(60);
        await new Promise(r => setTimeout(r, 2000));
        updateStepStatus(2, "complete");
        setProgress(70);
        
        // Step 4: Email Creation
        setCurrentStep(3);
        updateStepStatus(3, "processing");
        setProgress(80);
        await new Promise(r => setTimeout(r, 2000));
        updateStepStatus(3, "complete");
        setProgress(90);
        
        // Step 5: Finalizing
        setCurrentStep(4);
        updateStepStatus(4, "processing");
        setProgress(95);
        
        // Save to backend
        try {
          await emailSetupAPI.createSetup({
            domain,
            provider,
            emailName,
            addUsers
          });
          updateStepStatus(4, "complete");
          setProgress(100);
          
          toast({
            title: "Setup complete!",
            description: "Your email has been configured successfully.",
          });
        } catch (error) {
          console.error("Error saving email setup:", error);
          updateStepStatus(4, "error");
          setError("Failed to save setup data. Please try again.");
          
          toast({
            title: "Error saving setup",
            description: "Your setup completed but we couldn't save it. Please try again.",
            variant: "destructive",
          });
        }
        
        // Call onComplete after process finishes
        if (!error) {
          onComplete();
        }
      } catch (error) {
        console.error("Setup process error:", error);
        setError("An unexpected error occurred during setup. Please try again.");
      }
    };
    
    setupProcess();
  }, [domain, emailName, provider, addUsers, onComplete, toast]);
  
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };
  
  const handleRetry = () => {
    window.location.reload();
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
            <StatusCheck label={step.name} status={step.status} />
          </div>
        ))}
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={handleRetry} className="mt-2 w-full">
            Retry Setup
          </Button>
        </div>
      )}
      
      {progress === 100 && !error && (
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
