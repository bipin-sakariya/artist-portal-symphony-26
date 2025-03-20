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
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { Clock, MapPin, Music, Users, Calendar as CalendarIcon, Instagram, ExternalLink, ArrowRight, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample artist data
const artistData = {
  id: "1",
  name: "Sarah Johnson",
  tagline: "Soulful Jazz Vocalist & Pianist",
  rating: 4.8,
  reviews: 42,
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
  socialLinks: {
    instagram: "sarahjohnsonmusic",
    tiktok: "sarahjohnsonmusic",
    spotify: "sarahjohnsonmusic",
    youtube: "sarahjohnsonmusic",
  },
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
  tourDates: [
    { date: "June 24, 2024", venue: "Opera House", location: "Dubai, UAE" },
    { date: "July 5, 2024", venue: "Jazz Lounge", location: "Abu Dhabi, UAE" },
    { date: "July 15, 2024", venue: "The Music Hall", location: "Riyadh, KSA" },
    { date: "August 2, 2024", venue: "Arts Center", location: "Doha, Qatar" },
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
  budget: z.string().min(1, {
    message: "Please enter your budget.",
  }),
  additionalInfo: z.string().optional(),
});

const ArtistProfile = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Booking Request Submitted",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
    setIsBookingOpen(false);
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
        className="h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${artistData.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#121212]"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-gotham-bold mb-3 animate-fade-in">
              {artistData.name}
            </h1>
            <p className="text-xl md:text-2xl text-orange-400 font-gotham-book mb-6 animate-slide-in-left">
              {artistData.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
              <div className="flex items-center gap-1">
                <MapPin className="text-orange-400 h-4 w-4" />
                <span>{artistData.location}</span>
              </div>

              <div className="flex items-center gap-4 mt-2 md:mt-0">
                {artistData.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-md text-lg font-gotham-bold flex items-center gap-2 transition-all transform hover:scale-105 group">
                  Book Now
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-gotham-bold">Book {artistData.name}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Fill out the form below to request a booking.
                  </DialogDescription>
                </DialogHeader>
                
                <BookingForm 
                  form={form} 
                  onSubmit={onSubmit} 
                  isDateUnavailable={isDateUnavailable} 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Artist Info */}
          <div className="lg:col-span-2 space-y-16">
            {/* Bio */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">About the Artist</h2>
              <p className="text-gray-300 font-gotham-book leading-relaxed text-lg">{artistData.bio}</p>
            </div>

            {/* Media Players */}
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Listen & Watch</h2>
              
              {/* Spotify Player */}
              <div className="space-y-4">
                <h3 className="text-xl font-gotham-book text-orange-400 flex items-center gap-2">
                  <Music size={20} /> Spotify
                </h3>
                <div className="bg-[#181818] rounded-lg p-4 h-[352px] border border-gray-800">
                  <iframe 
                    src="https://open.spotify.com/embed/artist/5K4W6rqBFWDnAN6FQUkS6x?utm_source=generator" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
              
              {/* YouTube Player */}
              <div className="space-y-4">
                <h3 className="text-xl font-gotham-book text-orange-400 flex items-center gap-2">
                  <ExternalLink size={20} /> YouTube
                </h3>
                <div className="bg-[#181818] rounded-lg aspect-video overflow-hidden border border-gray-800">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/ZwgH9KXgXdw" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Tour Dates */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Upcoming Tour Dates</h2>
              
              <div className="space-y-4">
                {artistData.tourDates.map((tour, idx) => (
                  <div key={idx} className="bg-[#181818] rounded-lg p-6 border border-gray-800 transition-transform hover:translate-x-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start md:items-center gap-4">
                      <div className="bg-orange-500/10 text-orange-400 p-3 rounded-lg">
                        <CalendarIcon size={24} />
                      </div>
                      <div>
                        <p className="text-xl font-gotham-bold">{tour.venue}</p>
                        <p className="text-gray-400">{tour.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-orange-400 font-gotham-bold">{tour.date}</span>
                      <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Experience</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artistData.experience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-[#181818] p-4 rounded-lg border border-gray-800">
                    <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg">
                      <Star size={16} />
                    </div>
                    <span className="text-gray-300 font-gotham-book">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Services</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artistData.services.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-[#181818] p-4 rounded-lg border border-gray-800">
                    <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg">
                      <Music size={16} />
                    </div>
                    <span className="text-gray-300 font-gotham-book">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gallery */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {artistData.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-64 rounded-lg overflow-hidden bg-cover bg-center transition-transform hover:scale-105"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {artistData.testimonials.map((testimonial, idx) => (
                  <Card key={idx} className="bg-[#181818] border-gray-800 transition-transform hover:translate-y-[-5px]">
                    <CardContent className="p-8">
                      <p className="text-gray-300 italic mb-6 text-lg">"{testimonial.text}"</p>
                      <div>
                        <p className="font-gotham-bold text-white">{testimonial.name}</p>
                        <p className="text-orange-400 text-sm">{testimonial.event}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Social */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Book Artist */}
              <Card className="bg-[#181818] border-gray-800 overflow-hidden animate-fade-in">
                <div className="h-2 bg-orange-500"></div>
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-gotham-bold text-center text-white">Ready to Book?</h2>
                  <p className="text-gray-400 text-center">
                    Let Sarah create a memorable experience for your event
                  </p>
                  <Button 
                    onClick={() => setIsBookingOpen(true)} 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 font-gotham-bold text-lg"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-[#181818] border-gray-800 animate-fade-in">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-gotham-bold text-white">Follow Sarah</h2>
                  
                  <div className="space-y-4">
                    <a 
                      href={`https://instagram.com/${artistData.socialLinks.instagram}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#121212] text-white hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                    >
                      <Instagram size={24} />
                      <span className="font-gotham-book">@{artistData.socialLinks.instagram}</span>
                    </a>
                    
                    <a 
                      href={`https://tiktok.com/@${artistData.socialLinks.tiktok}`} 
                      target="_blank"
                      rel="noreferrer" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#121212] text-white hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                      <span className="font-gotham-book">@{artistData.socialLinks.tiktok}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              
              <p className="text-gray-400">Soulful Jazz Vocalist & Pianist</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-400">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400">
                <Music size={24} />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating Book Now Button */}
      <div className="fixed bottom-8 right-8 md:hidden z-40">
        <Button 
          onClick={() => setIsBookingOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
        >
          <CalendarIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

// Extracted Booking Form Component
const BookingForm = ({ 
  form, 
  onSubmit, 
  isDateUnavailable, 
  selectedDate,
  setSelectedDate
}: { 
  form: any, 
  onSubmit: (values: any) => void, 
  isDateUnavailable: (date: Date) => boolean,
  selectedDate: Date | undefined,
  setSelectedDate: (date: Date | undefined) => void
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Event Type */}
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

        {/* Event Date - Dropdown Calendar */}
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
                    className="bg-[#232323] text-white pointer-events-auto"
                    classNames={{
                      caption_label: "text-white",
                      day: "text-gray-200",
                      day_selected: "bg-orange-500",
                      day_disabled: "text-gray-600 hover:bg-transparent",
                      head_cell: "text-orange-400",
                      nav_button: "opacity-100 text-white hover:bg-gray-700",
                    }}
                  />
                  <div className="p-2 border-t border-gray-700 text-xs text-orange-400">
                    Red dates are unavailable
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Attendees */}
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

          {/* Duration */}
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
          {/* Location */}
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

          {/* Budget */}
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

        {/* Additional Info - Smaller textarea */}
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

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 py-4">
          Submit Booking Request
        </Button>
      </form>
    </Form>
  );
};

export default ArtistProfile;
