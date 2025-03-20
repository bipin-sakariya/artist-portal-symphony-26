
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/ui";

interface AdditionalInfoFieldProps {
  control: any;
}

const AdditionalInfoField: React.FC<AdditionalInfoFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="additionalInfo"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Additional Information</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Any special requests or details about your event"
              className="resize-none bg-[#232323] border-gray-700 h-16 text-white focus:border-orange-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdditionalInfoField;
