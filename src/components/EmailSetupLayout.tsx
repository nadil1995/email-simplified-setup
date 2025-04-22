
import { ReactNode } from "react";
import StepProgress from "./StepProgress";
import { cn } from "@/lib/utils";

interface EmailSetupLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  className?: string;
}

const EmailSetupLayout = ({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  className,
}: EmailSetupLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      <header className="border-b py-4">
        <div className="container">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Email Setup</h1>
            <a href="#" className="text-sm text-primary">Need help?</a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8 md:py-12">
        {showProgress && (
          <StepProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            className="max-w-xl mx-auto mb-8"
          />
        )}
        
        <div className={cn("py-4", className)}>
          {children}
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            &copy; 2025 Email Setup Service. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailSetupLayout;
