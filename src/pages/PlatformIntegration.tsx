
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Mail, MailQuestion, X } from "lucide-react";
import { emailPlatformAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const PlatformIntegration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [microsoftConnected, setMicrosoftConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check connection status on component mount
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const googleStatus = await emailPlatformAPI.checkConnection("google");
        const microsoftStatus = await emailPlatformAPI.checkConnection("microsoft");
        
        setGoogleConnected(googleStatus);
        setMicrosoftConnected(microsoftStatus);
      } catch (error) {
        console.error("Error checking connections:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkConnections();
  }, []);

  const handleConnectGoogle = () => {
    emailPlatformAPI.connectToGoogle();
  };

  const handleConnectMicrosoft = () => {
    emailPlatformAPI.connectToMicrosoft();
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="flex flex-col items-center space-y-6 text-center mb-10">
        <h1 className="text-3xl font-bold">Email Platform Integration</h1>
        <p className="text-muted-foreground max-w-lg">
          Connect your Google Workspace or Microsoft 365 account to automate email account creation and management.
        </p>
      </div>

      <Tabs defaultValue="google" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google">Google Workspace</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft 365</TabsTrigger>
        </TabsList>

        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Google Workspace Integration
              </CardTitle>
              <CardDescription>
                Connect your Google Workspace admin account to automate email setup with Gmail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Connection Status</p>
                    <p className="text-sm text-muted-foreground">
                      Your Google Workspace admin access
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <div className="text-muted-foreground">Checking...</div>
                    ) : googleConnected ? (
                      <>
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-green-600 font-medium">Connected</span>
                      </>
                    ) : (
                      <>
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-red-600 font-medium">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">What this enables:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Automatic Gmail account creation for your domain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Manage user settings and permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Set up email groups and aliases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!googleConnected ? (
                <Button onClick={handleConnectGoogle} className="w-full">
                  Connect to Google Workspace
                </Button>
              ) : (
                <div className="w-full flex gap-3">
                  <Button variant="outline" onClick={handleGoToDashboard} className="flex-1">
                    Go to Dashboard
                  </Button>
                  <Button onClick={handleConnectGoogle} className="flex-1">
                    Reconnect
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="microsoft">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MailQuestion className="h-5 w-5" />
                Microsoft 365 Integration
              </CardTitle>
              <CardDescription>
                Connect your Microsoft 365 admin account to automate email setup with Outlook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Connection Status</p>
                    <p className="text-sm text-muted-foreground">
                      Your Microsoft 365 admin access
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <div className="text-muted-foreground">Checking...</div>
                    ) : microsoftConnected ? (
                      <>
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-green-600 font-medium">Connected</span>
                      </>
                    ) : (
                      <>
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-red-600 font-medium">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">What this enables:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Automatic Outlook account creation for your domain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Integrate with Microsoft 365 apps and services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Manage user licenses and security settings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!microsoftConnected ? (
                <Button onClick={handleConnectMicrosoft} className="w-full">
                  Connect to Microsoft 365
                </Button>
              ) : (
                <div className="w-full flex gap-3">
                  <Button variant="outline" onClick={handleGoToDashboard} className="flex-1">
                    Go to Dashboard
                  </Button>
                  <Button onClick={handleConnectMicrosoft} className="flex-1">
                    Reconnect
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={handleGoToDashboard}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PlatformIntegration;
