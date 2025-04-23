import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { authAPI } from "@/services/api";
import SubscriptionPaymentHandler from "@/components/SubscriptionPaymentHandler";

const Pricing = () => {
  const isLoggedIn = authAPI.isLoggedIn();

  const plans = [
    {
      name: "Basic",
      price: "$10",
      period: "per month",
      stripePriceId: "price_basic", // Replace with actual Stripe price ID
      features: [
        "1 Email Account",
        "5GB Storage",
        "Basic Support",
        "Webmail Access"
      ]
    },
    {
      name: "Business",
      price: "$25",
      period: "per month",
      stripePriceId: "price_business", // Replace with actual Stripe price ID
      features: [
        "5 Email Accounts",
        "25GB Storage",
        "Priority Support",
        "Custom Domain",
        "Mobile Sync"
      ]
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      stripePriceId: "price_enterprise", // Replace with actual Stripe price ID
      features: [
        "Unlimited Email Accounts",
        "100GB Storage",
        "24/7 Support",
        "Custom Domain",
        "Advanced Security",
        "Admin Controls"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Email Setup Service</Link>
        <div className="flex gap-4">
          {!isLoggedIn && (
            <>
              <Button asChild variant="outline">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your email needs. All plans include our easy setup wizard and professional support.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-6 bg-card">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <SubscriptionPaymentHandler plan={plan} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
