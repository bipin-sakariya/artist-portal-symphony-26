
import React from "react";
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

interface EventTypeFieldProps {
  control: any;
}

const EventTypeField: React.FC<EventTypeFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="eventType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Event Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger 
                className="bg-[#232323] border-gray-700 text-white focus:ring-0 focus:ring-offset-0 focus:border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#232323] border-gray-700 text-white">
              <SelectItem value="private" className="text-white">Private event</SelectItem>
              <SelectItem value="wedding" className="text-white">Wedding</SelectItem>
              <SelectItem value="corporate" className="text-white">Corporate events</SelectItem>
              <SelectItem value="festival" className="text-white">Festival / Concert</SelectItem>
              <SelectItem value="conference" className="text-white">Conference</SelectItem>
              <SelectItem value="bar" className="text-white">Bar / Club</SelectItem>
              <SelectItem value="advertising" className="text-white">Advertising / Influencer Marketing</SelectItem>
              <SelectItem value="appearance" className="text-white">Special Appearance</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventTypeField;
