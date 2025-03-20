
import React from "react";
import { Users } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

interface AttendeesFieldProps {
  control: any;
}

const AttendeesField: React.FC<AttendeesFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="attendees"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Number of Attendees</FormLabel>
          <FormControl>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Estimated guests"
                className="bg-[#232323] border-gray-700 pl-10 text-white focus:border-orange-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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

export default AttendeesField;
