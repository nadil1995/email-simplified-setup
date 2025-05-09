import { useEffect, useState } from "react";
import { emailSetupAPI, authAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Globe, Users, ArrowRight, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailSetup {
  id: number;
  domain: string;
  provider: string;
  emailName: string;
  addUsers: boolean;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [emailSetups, setEmailSetups] = useState<EmailSetup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();

  useEffect(() => {
    const fetchEmailSetups = async () => {
      try {
        const data = await emailSetupAPI.getAllSetups();
        setEmailSetups(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load email setups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmailSetups();
  }, [toast]);

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google Workspace";
      case "microsoft":
        return "Microsoft 365";
      case "aws":
        return "AWS WorkMail";
      default:
        return provider;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user && (
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to="/setup">
            <Button>
              Set Up New Email <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/email">
            <Button variant="secondary">
              <Mail className="mr-2 h-4 w-4" />
              Access Email
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading email setups...</p>
          </div>
        </div>
      ) : emailSetups.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No email setups yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't configured any email accounts yet. Get started by setting up your first email.
            </p>
            <Button asChild>
              <Link to="/setup">Set Up Email</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {emailSetups.map((setup) => (
            <Card key={setup.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{setup.domain}</CardTitle>
                  <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {getProviderName(setup.provider)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Primary: <strong>{setup.emailName}@{setup.domain}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>DNS Status: <span className="text-green-500">Active</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Users Enabled: <strong>{setup.addUsers ? "Yes" : "No"}</strong></span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created on {new Date(setup.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                    <Link to="/email" className="flex-1">
                      <Button size="sm" className="w-full">Access Email</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
