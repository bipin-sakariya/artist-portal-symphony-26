
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  valueClassName,
}: StatCardProps) => {
  return (
    <div className={cn(
      "glass-card p-6 flex flex-col relative group overflow-hidden transition-all duration-300 hover:shadow-elevated border-0",
      "bg-gradient-to-br from-white to-slate-50/90 dark:from-slate-900/90 dark:to-slate-950/95",
      "backdrop-blur-lg",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 font-display">{title}</h3>
      </div>
      
      <div className="mt-2">
        <p className={cn(
          "text-3xl font-bold font-display tracking-tight",
          valueClassName || "text-slate-900 dark:text-white"
        )}>
          {value}
        </p>
        
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "inline-flex items-center text-xs font-medium font-display",
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-display">
                {description}
              </span>
            )}
          </div>
        )}
        
        {!trend && description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-display">
            {description}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/30 via-violet-500/40 to-fuchsia-500/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </div>
  );
};

export default StatCard;
