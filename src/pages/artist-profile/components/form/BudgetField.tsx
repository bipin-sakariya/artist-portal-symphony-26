
import React from "react";
import { Info } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";

interface BudgetFieldProps {
  control: any;
}

const BudgetField: React.FC<BudgetFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="budget"
      render={({ field }) => (
        <FormItem className="flex flex-col justify-start h-full">
          <FormLabel className="text-white flex items-center gap-2 mb-2">
            Your Budget (USD)
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex">
                    <Info className="h-4 w-4 text-orange-400 cursor-help" />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start" 
                  className="bg-[#232323] border-gray-700 text-white max-w-[280px] z-50"
                  sideOffset={5}
                >
                  <p className="text-sm">AMP will provide the necessary Tech & Hospitality requirements for the artist to perform at your event, and this will be included as part of the budget.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <Input
                placeholder="Enter your budget"
                className="bg-[#232323] border-gray-700 pl-8 text-white focus:border-orange-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BudgetField;
