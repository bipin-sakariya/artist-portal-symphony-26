
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Button,
  Calendar,
  Card,
  CardContent,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clock, MapPin, Music, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample artist data
const artistData = {
  id: "1",
  name: "Sarah Johnson",
  tagline: "Soulful Jazz Vocalist & Pianist",
  rating: 4.8,
  reviews: 42,
  hourlyRate: 350,
  location: "Dubai, UAE",
  genres: ["Jazz", "Soul", "R&B"],
  bio: "Sarah Johnson is an award-winning jazz vocalist and pianist with over 15 years of performance experience. Her smooth, soulful voice has captivated audiences across the Middle East and Europe. Sarah specializes in creating intimate musical experiences perfect for corporate events, weddings, and private gatherings.",
  experience: [
    "Performed at Dubai Jazz Festival (2019-2023)",
    "Regular performer at Burj Al Arab's Skyview Bar",
    "Opened for Grammy-winning artists",
    "Released two original albums",
  ],
  services: [
    "Solo piano and vocal performances",
    "Jazz trio or quartet arrangements",
    "Custom song requests",
    "Background music for sophisticated events",
  ],
  imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
  galleryImages: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532180282180-f3bb1613f540?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574154894072-16736a4f0b8b?q=80&w=1470&auto=format&fit=crop",
  ],
  testimonials: [
    {
      name: "Ahmed Al Mansouri",
      event: "Corporate Gala",
      text: "Sarah created the perfect atmosphere for our annual corporate gala. Her performance was the highlight of the evening, and many guests specifically mentioned how much they enjoyed the music.",
    },
    {
      name: "Layla and Omar",
      event: "Wedding Reception",
      text: "We couldn't have asked for a better musician for our special day. Sarah learned our favorite song and performed it beautifully for our first dance. Truly magical!",
    },
  ],
  unavailableDates: [
    new Date(2024, 6, 15),
    new Date(2024, 6, 16),
    new Date(2024, 6, 17),
    new Date(2024, 6, 25),
    new Date(2024, 6, 26),
    new Date(2024, 7, 5),
    new Date(2024, 7, 10),
    new Date(2024, 7, 11),
    new Date(2024, 7, 12),
  ],
};

// Form schema
const formSchema = z.object({
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
  additionalInfo: z.string().optional(),
});

const ArtistProfile = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      attendees: "",
      duration: "",
      location: "",
      additionalInfo: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Booking Request Submitted",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
    // In a real app, this would send data to an API
    setTimeout(() => navigate("/dashboard"), 2000);
  }

  // Date disabling function
  const isDateUnavailable = (date: Date) => {
    return artistData.unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getDate() === date.getDate() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Hero Section */}
      <div
        className="h-[50vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${artistData.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#121212]"></div>
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-gotham-bold mb-2">
              {artistData.name}
            </h1>
            <p className="text-xl text-orange-400 font-gotham-book mb-4">
              {artistData.tagline}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400 h-4 w-4" />
                <span>{artistData.rating}</span>
                <span className="text-gray-400">
                  ({artistData.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="text-orange-400 h-4 w-4" />
                <span>{artistData.location}</span>
              </div>
              <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                ${artistData.hourlyRate}/hour
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Artist Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2">
              {artistData.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-2xl font-gotham-bold mb-4">About the Artist</h2>
              <p className="text-gray-300 font-gotham-book">{artistData.bio}</p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-2xl font-gotham-bold mb-4">Experience</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 font-gotham-book">
                {artistData.experience.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-gotham-bold mb-4">Services</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 font-gotham-book">
                {artistData.services.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-2xl font-gotham-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {artistData.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-48 rounded-lg overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-gotham-bold mb-4">Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artistData.testimonials.map((testimonial, idx) => (
                  <Card key={idx} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <p className="text-gray-300 italic mb-4">"{testimonial.text}"</p>
                      <div>
                        <p className="font-gotham-bold">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.event}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-gotham-bold mb-6 text-center">Book This Artist</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Event Type */}
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="corporate">Corporate Event</SelectItem>
                            <SelectItem value="birthday">Birthday Party</SelectItem>
                            <SelectItem value="private">Private Gathering</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Event Date */}
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <div className="bg-gray-900 border border-gray-700 rounded-md p-3">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                              }}
                              disabled={isDateUnavailable}
                              className="bg-gray-900"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Red dates are unavailable.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Attendees */}
                  <FormField
                    control={form.control}
                    name="attendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Attendees</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Estimated number of guests"
                              className="bg-gray-900 border-gray-700 pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Performance Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-900 border-gray-700">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                <SelectValue placeholder="Select duration" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="1hour">1 hour</SelectItem>
                            <SelectItem value="2hours">2 hours</SelectItem>
                            <SelectItem value="3hours">3 hours</SelectItem>
                            <SelectItem value="4hours">4 hours</SelectItem>
                            <SelectItem value="custom">Custom (specify in notes)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-900 border-gray-700">
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                <SelectValue placeholder="Select location" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="dubai">Dubai</SelectItem>
                            <SelectItem value="abudhabi">Abu Dhabi</SelectItem>
                            <SelectItem value="sharjah">Sharjah</SelectItem>
                            <SelectItem value="riyadh">Riyadh</SelectItem>
                            <SelectItem value="jeddah">Jeddah</SelectItem>
                            <SelectItem value="qatar">Qatar</SelectItem>
                            <SelectItem value="cairo">Cairo</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Info */}
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or details about your event"
                            className="resize-none bg-gray-900 border-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    Request Booking
                  </Button>
                </form>
              </Form>

              {/* Price Information */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-2">Starting from</p>
                <p className="text-2xl font-gotham-bold text-orange-400">
                  ${artistData.hourlyRate} <span className="text-sm text-gray-400">per hour</span>
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Final price depends on event details and duration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
