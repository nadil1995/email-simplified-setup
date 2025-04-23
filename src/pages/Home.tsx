
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { authAPI } from "@/services/api";
import UserProfile from "@/components/auth/UserProfile";

const Home = () => {
  const isLoggedIn = authAPI.isLoggedIn();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      <header className="container py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Setup Service</h1>
        <div className="flex gap-4 items-center">
          <Button asChild variant="ghost">
            <Link to="/pricing">Pricing</Link>
          </Button>
          {!isLoggedIn ? (
            <>
              <Button asChild variant="outline">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/setup">Go to Setup</Link>
              </Button>
              <UserProfile />
            </>
          )}
        </div>
      </header>
      
      <main className="flex-1 container flex flex-col items-center justify-center text-center px-4 pb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Streamline Your Email Setup
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Easily configure professional email for your domain with our guided setup process.
          Get started in minutes with our intuitive wizard.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </main>
      
      <footer id="features" className="border-t py-10 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Easy Setup</h3>
              <p className="text-muted-foreground">Configure your professional email in minutes with our step-by-step wizard.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Multi-Provider</h3>
              <p className="text-muted-foreground">Support for Google Workspace, Microsoft 365, and AWS WorkMail.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">User Management</h3>
              <p className="text-muted-foreground">Create and manage email accounts for your entire team.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
