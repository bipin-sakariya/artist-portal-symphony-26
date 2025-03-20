
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { artistData } from "../data";

export const formSchema = z.object({
  eventType: z.string({
    required_error: "Please select an event type.",
  }),
  eventDate: z.date({
    required_error: "Please select a date for the event.",
  }),
  attendees: z.string().min(1, {
    message: "Please enter the estimated number of attendees.",
  }),
  duration: z.string({
    required_error: "Please select the performance duration.",
  }),
  location: z.string({
    required_error: "Please select the event location.",
  }),
  budget: z.string().min(1, {
    message: "Please enter your budget.",
  }),
  additionalInfo: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof formSchema>;

export const useBookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      attendees: "",
      duration: "",
      location: "",
      budget: "",
      additionalInfo: "",
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    console.log(values);
    toast({
      title: "Booking Request Submitted",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
    setIsBookingOpen(false);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const isDateUnavailable = (date: Date) => {
    return artistData.unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getDate() === date.getDate() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getFullYear() === date.getFullYear()
    );
  };

  return {
    form,
    selectedDate,
    setSelectedDate,
    isBookingOpen,
    setIsBookingOpen,
    onSubmit,
    isDateUnavailable,
  };
};
