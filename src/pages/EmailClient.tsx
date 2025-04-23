
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailSidebar from "@/components/email/EmailSidebar";
import EmailList from "@/components/email/EmailList";
import ComposeEmail from "@/components/email/ComposeEmail";
import EmailView from "@/components/email/EmailView";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Trash2, AlertCircle } from "lucide-react";

const EmailClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [viewMode, setViewMode] = useState("list"); // list, view, compose
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Check if the user is logged in
  const user = authAPI.getCurrentUser();
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please login to access your email client.",
      variant: "destructive",
    });
    navigate("/auth");
    return null;
  }

  const handleComposeClick = () => {
    setViewMode("compose");
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setViewMode("view");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedEmail(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <EmailSidebar 
        activeFolder={activeFolder} 
        setActiveFolder={setActiveFolder}
        onComposeClick={handleComposeClick} 
      />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Email Client</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          {viewMode === "list" && (
            <Button onClick={handleComposeClick}>
              <Mail className="mr-2 h-4 w-4" />
              Compose New
            </Button>
          )}
          {(viewMode === "view" || viewMode === "compose") && (
            <Button variant="ghost" onClick={handleBackToList}>
              Back to {activeFolder}
            </Button>
          )}
        </div>

        <Card className="w-full">
          {viewMode === "compose" ? (
            <ComposeEmail onCancel={handleBackToList} />
          ) : viewMode === "view" ? (
            <EmailView email={selectedEmail} onBack={handleBackToList} />
          ) : (
            <CardContent className="p-0">
              <Tabs value={activeFolder} onValueChange={setActiveFolder} className="w-full">
                <div className="border-b">
                  <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                    <TabsTrigger
                      value="inbox"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Inbox
                    </TabsTrigger>
                    <TabsTrigger
                      value="sent"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Sent
                    </TabsTrigger>
                    <TabsTrigger
                      value="spam"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Spam
                    </TabsTrigger>
                    <TabsTrigger
                      value="trash"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Trash
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="inbox" className="mt-0">
                  <EmailList folder="inbox" onEmailClick={handleEmailClick} />
                </TabsContent>
                <TabsContent value="sent" className="mt-0">
                  <EmailList folder="sent" onEmailClick={handleEmailClick} />
                </TabsContent>
                <TabsContent value="spam" className="mt-0">
                  <EmailList folder="spam" onEmailClick={handleEmailClick} />
                </TabsContent>
                <TabsContent value="trash" className="mt-0">
                  <EmailList folder="trash" onEmailClick={handleEmailClick} />
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmailClient;
