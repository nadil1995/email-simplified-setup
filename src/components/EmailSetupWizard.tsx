
import { useState } from "react";
import EmailSetupLayout from "./EmailSetupLayout";
import Welcome from "./steps/Welcome";
import DomainInput from "./steps/DomainInput";
import ChooseProvider from "./steps/ChooseProvider";
import SetupDetails from "./steps/SetupDetails";
import AutomatedSetup from "./steps/AutomatedSetup";
import Success from "./steps/Success";
import { useToast } from "@/components/ui/use-toast";

const EmailSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Form state
  const [domain, setDomain] = useState("");
  const [provider, setProvider] = useState("");
  const [emailName, setEmailName] = useState("");
  const [addUsers, setAddUsers] = useState(false);
  
  const { toast } = useToast();

  // Step handlers
  const handleWelcomeNext = () => {
    setCurrentStep(2);
  };

  const handleDomainNext = (domainValue: string) => {
    setDomain(domainValue);
    setCurrentStep(3);
    toast({
      title: "Domain validated",
      description: `Using ${domainValue} for your email setup.`,
    });
  };

  const handleProviderNext = (providerValue: string) => {
    setProvider(providerValue);
    setCurrentStep(4);
  };

  const handleSetupDetailsNext = (emailNameValue: string, addUsersValue: boolean) => {
    setEmailName(emailNameValue);
    setAddUsers(addUsersValue);
    setCurrentStep(5);
    toast({
      title: "Email details confirmed",
      description: `Setting up ${emailNameValue}@${domain}`,
    });
  };

  const handleSetupComplete = () => {
    setCurrentStep(6);
    toast({
      title: "Setup complete!",
      description: "Your email has been configured successfully.",
      variant: "default",
    });
  };

  const handleGoToDashboard = () => {
    // In a real app, this would navigate to a dashboard page
    toast({
      title: "Dashboard",
      description: "This would navigate to your email dashboard.",
    });
  };

  // Step navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine which step to render
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Welcome onNext={handleWelcomeNext} />;
      case 2:
        return <DomainInput onNext={handleDomainNext} onBack={handleBack} />;
      case 3:
        return <ChooseProvider onNext={handleProviderNext} onBack={handleBack} />;
      case 4:
        return (
          <SetupDetails
            domain={domain}
            provider={provider}
            onNext={handleSetupDetailsNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AutomatedSetup
            domain={domain}
            emailName={emailName}
            provider={provider}
            onComplete={handleSetupComplete}
          />
        );
      case 6:
        return (
          <Success
            domain={domain}
            emailName={emailName}
            provider={provider}
            onDashboard={handleGoToDashboard}
          />
        );
      default:
        return <Welcome onNext={handleWelcomeNext} />;
    }
  };

  return (
    <EmailSetupLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      showProgress={currentStep > 1 && currentStep < 6}
    >
      {renderStep()}
    </EmailSetupLayout>
  );
};

export default EmailSetupWizard;
