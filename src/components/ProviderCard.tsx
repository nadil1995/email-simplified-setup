
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProviderCardProps {
  name: string;
  description: string;
  logo: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const ProviderCard = ({
  name,
  description,
  logo,
  selected,
  onClick,
  className,
}: ProviderCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative border rounded-lg p-4 cursor-pointer transition-all",
        "hover:border-primary hover:shadow-sm",
        selected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border",
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
          <img src={logo} alt={name} className="w-6 h-6 object-contain" />
        </div>
        <h3 className="font-medium">{name}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default ProviderCard;
