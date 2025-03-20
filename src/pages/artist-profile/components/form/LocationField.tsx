
import React from "react";
import { MapPin } from "lucide-react";
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

interface LocationFieldProps {
  control: any;
}

const LocationField: React.FC<LocationFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Event Location</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-[#232323] border-gray-700 text-white focus:ring-0 focus:ring-offset-0 focus:border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select location" />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#232323] border-gray-700 text-white">
              <SelectItem value="dubai" className="text-white">Dubai</SelectItem>
              <SelectItem value="abudhabi" className="text-white">Abu Dhabi</SelectItem>
              <SelectItem value="sharjah" className="text-white">Sharjah</SelectItem>
              <SelectItem value="riyadh" className="text-white">Riyadh</SelectItem>
              <SelectItem value="jeddah" className="text-white">Jeddah</SelectItem>
              <SelectItem value="qatar" className="text-white">Qatar</SelectItem>
              <SelectItem value="cairo" className="text-white">Cairo</SelectItem>
              <SelectItem value="other" className="text-white">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
