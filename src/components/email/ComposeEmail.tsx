
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Paperclip, Send, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { emailAPI } from "@/services/emailAPI";

interface ComposeEmailProps {
  onCancel: () => void;
  replyToEmail?: any;
}

interface EmailFormData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
}

const ComposeEmail = ({ onCancel, replyToEmail }: ComposeEmailProps) => {
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
    defaultValues: {
      to: replyToEmail ? replyToEmail.from : "",
      cc: "",
      bcc: "",
      subject: replyToEmail ? `Re: ${replyToEmail.subject}` : "",
      message: replyToEmail ? `\n\n------ Original Message ------\n${replyToEmail.body}` : "",
    }
  });

  const onSubmit = async (data: EmailFormData) => {
    setSending(true);
    try {
      await emailAPI.sendEmail({
        ...data,
        attachments
      });
      
      toast({
        title: "Success",
        description: "Your email has been sent successfully.",
      });
      
      onCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments([...attachments, ...fileList]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <>
      <CardContent className="p-6">
        <form id="compose-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="to">To</Label>
            <Input 
              id="to" 
              placeholder="recipient@example.com" 
              {...register("to", { required: "Recipient is required" })}
            />
            {errors.to && <p className="text-sm text-destructive mt-1">{errors.to.message}</p>}
          </div>
          
          <Collapsible open={showCcBcc} onOpenChange={setShowCcBcc}>
            <div className="flex justify-end">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
                  Cc/Bcc
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4">
              <div>
                <Label htmlFor="cc">Cc</Label>
                <Input id="cc" placeholder="cc@example.com" {...register("cc")} />
              </div>
              
              <div>
                <Label htmlFor="bcc">Bcc</Label>
                <Input id="bcc" placeholder="bcc@example.com" {...register("bcc")} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Email subject" 
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Write your message here..." 
              className="min-h-[200px]"
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
          </div>
          
          {attachments.length > 0 && (
            <div className="border rounded-md p-3">
              <Label>Attachments</Label>
              <div className="mt-2 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Paperclip className="h-4 w-4" />
              Attach Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          form="compose-form" 
          disabled={sending}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending..." : "Send Email"}
        </Button>
      </CardFooter>
    </>
  );
};

export default ComposeEmail;
