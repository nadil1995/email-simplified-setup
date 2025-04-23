
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailSetupWizard from "@/components/EmailSetupWizard";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!authAPI.isLoggedIn()) {
      toast({
        title: "Authentication Required",
        description: "Please login to start setting up your email.",
        variant: "destructive",
      });
      navigate("/auth", { state: { from: "/setup" } });
    }
  }, [navigate, toast]);

  const isLoggedIn = authAPI.isLoggedIn();
  
  if (!isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return <EmailSetupWizard />;
};

export default Setup;
