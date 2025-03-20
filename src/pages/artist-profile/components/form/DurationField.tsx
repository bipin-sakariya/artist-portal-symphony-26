
import React from "react";
import { Clock } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface DurationFieldProps {
  control: any;
}

const DurationField: React.FC<DurationFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Performance Duration</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-[#232323] border-gray-700 text-white focus:ring-0 focus:ring-offset-0 focus:border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select duration" />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#232323] border-gray-700 text-white">
              <SelectItem value="1hour" className="text-white">1 hour</SelectItem>
              <SelectItem value="2hours" className="text-white">2 hours</SelectItem>
              <SelectItem value="3hours" className="text-white">3 hours</SelectItem>
              <SelectItem value="4hours" className="text-white">4 hours</SelectItem>
              <SelectItem value="custom" className="text-white">Custom</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DurationField;
