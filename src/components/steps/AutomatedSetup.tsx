
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StatusCheck from "../StatusCheck";

interface AutomatedSetupProps {
  domain: string;
  emailName: string;
  provider: string;
  onComplete: () => void;
}

type SetupStage = {
  id: string;
  label: string;
  status: "waiting" | "processing" | "complete" | "error";
};

const AutomatedSetup = ({ domain, emailName, provider, onComplete }: AutomatedSetupProps) => {
  const [setupStages, setSetupStages] = useState<SetupStage[]>([
    { id: "dns-check", label: "Checking DNS configuration", status: "waiting" },
    { id: "mx-records", label: "Adding MX Records", status: "waiting" },
    { id: "spf-dkim", label: "Setting up SPF/DKIM verification", status: "waiting" },
    { id: "mailbox", label: "Creating mailbox", status: "waiting" },
    { id: "verification", label: "Verifying setup", status: "waiting" }
  ]);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [isComplete, setIsComplete] = useState(false);

  // Simulate the setup process
  useEffect(() => {
    if (currentStageIndex >= setupStages.length) {
      setIsComplete(true);
      return;
    }
    
    // Start the current stage
    setSetupStages(current => {
      const updated = [...current];
      updated[currentStageIndex].status = "processing";
      return updated;
    });
    
    // Simulate processing time (different for each stage)
    const processingTimes = [3000, 5000, 4000, 6000, 3000];
    
    const timer = setTimeout(() => {
      // Complete the current stage
      setSetupStages(current => {
        const updated = [...current];
        updated[currentStageIndex].status = "complete";
        return updated;
      });
      
      // Move to the next stage
      setCurrentStageIndex(prev => prev + 1);
    }, processingTimes[currentStageIndex]);
    
    return () => clearTimeout(timer);
  }, [currentStageIndex, setupStages.length]);
  
  // Countdown timer
  useEffect(() => {
    if (isComplete || timeRemaining <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, isComplete]);
  
  // Format the remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Setting Up Your Email</h2>
      <p className="text-center text-muted-foreground mb-6">
        Please wait while we configure your email for {emailName}@{domain}
      </p>
      
      <div className="bg-muted/30 rounded-lg border p-4 mb-4">
        <div className="space-y-1">
          {setupStages.map((stage) => (
            <StatusCheck
              key={stage.id}
              label={stage.label}
              status={stage.status}
            />
          ))}
        </div>
      </div>
      
      {!isComplete ? (
        <div className="text-center space-y-4">
          <div className="animate-pulse-slow">
            <p className="text-sm font-medium">Please don't close this window</p>
            <p className="text-sm text-muted-foreground">
              Estimated time remaining: {formatTime(timeRemaining)}
            </p>
          </div>
          
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full animate-progress"
              style={{ 
                animationDuration: `${180}s`,
                animationTimingFunction: 'linear'
              }}
            />
          </div>
        </div>
      ) : (
        <Button onClick={onComplete} className="w-full">
          Continue to Final Step
        </Button>
      )}
    </div>
  );
};

export default AutomatedSetup;
