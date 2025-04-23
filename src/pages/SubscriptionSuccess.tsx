
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authAPI } from "@/services/api";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const SubscriptionSuccess = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.isLoggedIn()) {
        toast({
          title: "Authentication Required",
          description: "Please login to view subscription details.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Fetch subscription details
      try {
        const user = authAPI.getCurrentUser();
        const response = await axios.get("/api/subscription-status", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        setSubscription(response.data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg animate-pulse">Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription?.active) {
    return (
      <div className="min-h-screen container py-12">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Subscription</h1>
          <p className="text-muted-foreground mb-6">
            You don't currently have an active subscription.
          </p>
          <Button asChild>
            <Link to="/pricing">View Plans</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen container py-12">
      <Card className="max-w-md mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Subscription Activated!</h1>
        <p className="text-center text-muted-foreground mb-6">
          Thank you for subscribing to our service
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Plan:</span>
            <span>{subscription.planName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{subscription.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Next billing date:</span>
            <span>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button asChild>
            <Link to="/setup" className="flex items-center justify-center">
              Set Up Your Email <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
