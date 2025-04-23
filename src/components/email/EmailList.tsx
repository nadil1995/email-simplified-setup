
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { emailAPI } from "@/services/emailAPI";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  hasAttachment: boolean;
}

interface EmailListProps {
  folder: string;
  onEmailClick: (email: Email) => void;
}

const EmailList = ({ folder, onEmailClick }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const data = await emailAPI.getEmails(folder);
        setEmails(data as Email[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load emails. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [folder, toast]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading emails...</p>
        </div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-xl font-medium mb-2">No emails in {folder}</p>
        <p className="text-muted-foreground mb-4">
          {folder === "inbox" 
            ? "Your inbox is empty. When you receive emails, they'll appear here."
            : folder === "sent" 
            ? "You haven't sent any emails yet."
            : folder === "trash" 
            ? "Your trash is empty."
            : "There are no emails in this folder."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {emails.map((email) => (
        <div 
          key={email.id} 
          className="flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => onEmailClick(email)}
        >
          <div className="mr-2">
            <Checkbox checked={email.read} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium truncate">{email.from}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(email.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm font-medium truncate">{email.subject}</div>
              {email.hasAttachment && (
                <Badge variant="outline" className="ml-2">
                  Attachment
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">{email.preview}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
