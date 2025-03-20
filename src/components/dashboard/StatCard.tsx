
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  valueClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
  valueClassName,
}: StatCardProps) => {
  return (
    <div className={cn(
      "glass-card p-3 flex flex-col relative group overflow-hidden transition-all duration-300 hover:shadow-elevated",
      "bg-gradient-to-br from-white/80 to-slate-50/70 dark:from-slate-900/80 dark:to-slate-800/70",
      "backdrop-blur-md border-0 rounded-xl",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-medium text-slate-600 dark:text-slate-300 font-display">{title}</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className={cn(
          "text-xl font-bold font-display tracking-tight text-center",
          valueClassName || "text-slate-900 dark:text-white"
        )}>
          {value}
        </p>
        
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-display text-center">
            {description}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-violet-500/40 to-fuchsia-500/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </div>
  );
};

export default StatCard;
