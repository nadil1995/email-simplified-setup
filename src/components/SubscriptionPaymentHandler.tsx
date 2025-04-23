
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { authAPI } from "@/services/api";

interface SubscriptionPaymentHandlerProps {
  plan: {
    name: string;
    price: string;
    period: string;
    features: string[];
    stripePriceId: string;
  };
}

const SubscriptionPaymentHandler = ({ plan }: SubscriptionPaymentHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isLoggedIn = authAPI.isLoggedIn();

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current user token
      const user = authAPI.getCurrentUser();
      
      // Call our backend to create a Stripe checkout session
      const response = await axios.post(
        "/api/create-checkout-session",
        {
          priceId: plan.stripePriceId,
          planName: plan.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      if (response.data && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        isLoggedIn ? "Choose Plan" : "Login to Subscribe"
      )}
    </Button>
  );
};

export default SubscriptionPaymentHandler;
