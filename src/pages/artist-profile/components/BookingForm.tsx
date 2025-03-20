
import React from "react";
import { format } from "date-fns";
import { Clock, MapPin, Users, CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Textarea,
  Calendar,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { BookingFormValues } from "../hooks/useBookingForm";

type BookingFormProps = {
  form: any;
  onSubmit: (values: BookingFormValues) => void;
  isDateUnavailable: (date: Date) => boolean;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
};

const BookingForm: React.FC<BookingFormProps> = ({
  form,
  onSubmit,
  isDateUnavailable,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Event Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#232323] border-gray-700 text-white">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#232323] border-gray-700 text-white">
                  <SelectItem value="wedding" className="text-white">Wedding</SelectItem>
                  <SelectItem value="corporate" className="text-white">Corporate Event</SelectItem>
                  <SelectItem value="birthday" className="text-white">Birthday Party</SelectItem>
                  <SelectItem value="private" className="text-white">Private Gathering</SelectItem>
                  <SelectItem value="other" className="text-white">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white">Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full flex items-center justify-between bg-[#232323] border-gray-700 text-white hover:bg-[#2a2a2a] hover:text-white ${!field.value && "text-gray-400"}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Number of Attendees</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Estimated guests"
                      className="bg-[#232323] border-gray-700 pl-10 text-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Performance Duration</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#232323] border-gray-700 text-white">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Event Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#232323] border-gray-700 text-white">
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

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Your Budget (USD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      placeholder="Enter your budget"
                      className="bg-[#232323] border-gray-700 pl-8 text-white"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or details about your event"
                  className="resize-none bg-[#232323] border-gray-700 h-16 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 py-4">
          Submit Booking Request
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
