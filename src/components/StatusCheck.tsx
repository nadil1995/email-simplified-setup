
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "waiting" | "processing" | "complete" | "error";

interface StatusCheckProps {
  label: string;
  status: Status;
  className?: string;
}

const StatusCheck = ({ label, status, className }: StatusCheckProps) => {
  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      <div className="relative">
        {status === "waiting" && (
          <div className="w-5 h-5 rounded-full border border-muted-foreground" />
        )}
        {status === "processing" && (
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        )}
        {status === "complete" && (
          <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
        {status === "error" && (
          <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
      <span className={cn(
        "text-sm",
        status === "waiting" && "text-muted-foreground",
        status === "processing" && "text-primary animate-pulse-slow",
        status === "complete" && "text-brand-green",
        status === "error" && "text-destructive"
      )}>
        {label}
      </span>
    </div>
  );
};

export default StatusCheck;
