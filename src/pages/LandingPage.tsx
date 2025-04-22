
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$5/mo",
    features: [
      "1 mailbox",
      "All DNS setup automated",
      "Support for custom domain",
      "24/7 support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "Up to 10 mailboxes",
      "Google/Outlook integration",
      "DNS & routing optimized",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "$25/mo",
    features: [
      "Unlimited mailboxes",
      "User & alias management",
      "Advanced analytics",
      "Custom migration help",
    ],
    highlighted: false,
  },
];

const features = [
  {
    title: "One-click setup",
    description:
      "Create a professional email for your business automatically. No tech skills needed.",
  },
  {
    title: "Connect your domain",
    description:
      "Our wizard automates DNS changes, so you can focus on your business.",
  },
  {
    title: "Major platform support",
    description:
      "Works seamlessly with Google Workspace, Outlook, and more.",
  },
  {
    title: "Simplified dashboard",
    description:
      "See your email setup status and add users in seconds (more features coming soon!).",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <header className="container max-w-4xl pt-16 pb-12 text-center mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Set Up a Professional Email For Your Business, Fast.
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Get <span className="font-bold">yourname@yourdomain.com</span> in just a few minutes. <br className="hidden md:block"/> No confusing DNS, no coding, no headaches.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
          <a href="#pricing" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              View Pricing
            </Button>
          </a>
        </div>
      </header>
      {/* FEATURE SECTION */}
      <section className="container max-w-4xl py-12 mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Email Simplified?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg bg-muted/50 p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* PRICING SECTION */}
      <section id="pricing" className="bg-muted/40 py-16">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Simple Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex-1 rounded-xl bg-card shadow-md p-8 border-2 ${
                  plan.highlighted
                    ? "border-primary scale-105 z-10"
                    : "border-border"
                } transition-all duration-300`}
              >
                <h3 className="font-semibold text-xl mb-2 text-center">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold mb-6 text-center">{plan.price}</div>
                <ul className="mb-8 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground">
                      <span className="inline-block w-3 h-3 bg-primary rounded-full" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/" className="flex">
                  <Button
                    size="lg"
                    variant={plan.highlighted ? "default" : "outline"}
                    className="flex-1"
                  >
                    {plan.highlighted ? "Start Pro" : "Start"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="mt-auto py-8 bg-muted/50 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Email Simplified. All rights reserved.
      </footer>
    </div>
  );
}
