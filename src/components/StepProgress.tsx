
import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const StepProgress = ({ currentStep, totalSteps, className }: StepProgressProps) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="step-progress">
        <div 
          className="step-progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
};

export default StepProgress;
