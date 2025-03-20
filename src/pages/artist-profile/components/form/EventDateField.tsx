
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface EventDateFieldProps {
  control: any;
  isDateUnavailable: (date: Date) => boolean;
  setSelectedDate: (date: Date | undefined) => void;
}

const EventDateField: React.FC<EventDateFieldProps> = ({ 
  control, 
  isDateUnavailable,
  setSelectedDate 
}) => {
  return (
    <FormField
      control={control}
      name="eventDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-white">Event Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex items-center justify-between bg-[#232323] border-gray-700 text-white hover:bg-[#2a2a2a] hover:text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-orange-500",
                    !field.value && "text-gray-400"
                  )}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </div>
                  <div className="opacity-60">▼</div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#232323] border-gray-700">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
                disabled={isDateUnavailable}
                className="bg-[#232323] text-white"
                classNames={{
                  head_cell: "text-orange-400",
                  nav_button: "text-white hover:bg-gray-700",
                }}
              />
              <div className="p-3 border-t border-gray-700 text-xs text-red-400 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/20 rounded-sm"></div>
                <span>Red dates are unavailable</span>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventDateField;
