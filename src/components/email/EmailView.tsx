
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Reply, Forward, Trash2, AlertCircle, Mail, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { emailAPI } from "@/services/emailAPI";

interface EmailViewProps {
  email: any;
  onBack: () => void;
}

const EmailView = ({ email, onBack }: EmailViewProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!email) {
    return (
      <CardContent className="p-6 text-center">
        <p>No email selected</p>
        <Button onClick={onBack} className="mt-4">
          Back
        </Button>
      </CardContent>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await emailAPI.deleteEmail(email.id);
      toast({
        title: "Email Deleted",
        description: "The email has been moved to trash.",
      });
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete email.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = () => {
    // Implementation would depend on your app structure
    console.log("Reply to email", email.id);
  };

  const handleForward = () => {
    // Implementation would depend on your app structure
    console.log("Forward email", email.id);
  };

  const handleMarkSpam = async () => {
    try {
      await emailAPI.markAsSpam(email.id);
      toast({
        title: "Marked as Spam",
        description: "The email has been marked as spam.",
      });
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark email as spam.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{email.subject}</h2>
            <div className="text-sm text-muted-foreground">
              {new Date(email.date).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center mt-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">
              {email.from.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{email.from}</div>
              <div className="text-sm text-muted-foreground">To: me</div>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6">
            <div className="font-medium mb-2">Attachments ({email.attachments.length})</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center p-2 border rounded-md">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center rounded mr-3">
                    <Download className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{attachment.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      {attachment.size} - {attachment.type}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReply}>
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" onClick={handleForward}>
            <Forward className="mr-2 h-4 w-4" />
            Forward
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleMarkSpam}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Spam
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default EmailView;
