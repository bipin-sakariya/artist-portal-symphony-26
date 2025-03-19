
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
      "glass-card p-6 flex flex-col relative group overflow-hidden transition-all duration-300 hover:shadow-elevated",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      
      <div className="mt-2">
        <p className={cn(
          "text-3xl font-bold",
          valueClassName
        )}>
          {value}
        </p>
        
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "inline-flex items-center text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            {description && (
              <span className="text-xs text-muted-foreground ml-2">
                {description}
              </span>
            )}
          </div>
        )}
        
        {!trend && description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/5 via-primary/30 to-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    </div>
  );
};

export default StatCard;
