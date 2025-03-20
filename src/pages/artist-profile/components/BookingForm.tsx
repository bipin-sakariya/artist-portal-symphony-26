
import React from "react";
import { Button, Form } from "@/components/ui";
import { BookingFormValues } from "../hooks/useBookingForm";
import {
  EventTypeField,
  EventDateField,
  AttendeesField,
  DurationField,
  LocationField,
  BudgetField,
  AdditionalInfoField
} from "./form";

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
        <EventTypeField control={form.control} />
        
        <EventDateField 
          control={form.control} 
          isDateUnavailable={isDateUnavailable} 
          setSelectedDate={setSelectedDate} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AttendeesField control={form.control} />
          <DurationField control={form.control} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LocationField control={form.control} />
          <BudgetField control={form.control} />
        </div>

        <AdditionalInfoField control={form.control} />

        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 py-4">
          Submit Booking Request
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
