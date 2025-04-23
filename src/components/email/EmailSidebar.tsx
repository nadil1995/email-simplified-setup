
import { Button } from "@/components/ui/button";
import { 
  Mail, Send, AlertCircle, Trash2, 
  PenSquare, File, FileText, Inbox
} from "lucide-react";

interface EmailSidebarProps {
  activeFolder: string;
  setActiveFolder: (folder: string) => void;
  onComposeClick: () => void;
}

const EmailSidebar = ({ activeFolder, setActiveFolder, onComposeClick }: EmailSidebarProps) => {
  const folders = [
    { id: "inbox", name: "Inbox", icon: Inbox, count: 12 },
    { id: "sent", name: "Sent", icon: Send, count: 0 },
    { id: "spam", name: "Spam", icon: AlertCircle, count: 3 },
    { id: "trash", name: "Trash", icon: Trash2, count: 0 },
  ];

  return (
    <div className="w-64 border-r bg-muted/20 p-4 hidden md:block">
      <Button className="w-full mb-6" onClick={onComposeClick}>
        <PenSquare className="mr-2 h-4 w-4" />
        Compose
      </Button>

      <div className="space-y-1">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={activeFolder === folder.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveFolder(folder.id)}
          >
            <folder.icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{folder.name}</span>
            {folder.count > 0 && (
              <span className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                {folder.count}
              </span>
            )}
          </Button>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Signature</h3>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Edit Signature
        </Button>
      </div>
    </div>
  );
};

export default EmailSidebar;
