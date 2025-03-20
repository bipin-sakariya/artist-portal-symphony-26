
import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui";

// Components
import ArtistHeader from "./components/ArtistHeader";
import ArtistAbout from "./components/ArtistAbout";
import ArtistMedia from "./components/ArtistMedia";
import ArtistTourDates from "./components/ArtistTourDates";
import ArtistExperience from "./components/ArtistExperience";
import ArtistServices from "./components/ArtistServices";
import ArtistGallery from "./components/ArtistGallery";
import ArtistTestimonials from "./components/ArtistTestimonials";
import ArtistSidebar from "./components/ArtistSidebar";
import ArtistFooter from "./components/ArtistFooter";
import BookingForm from "./components/BookingForm";

// Hooks
import { useBookingForm } from "./hooks/useBookingForm";

const ArtistProfile: React.FC = () => {
  const {
    form,
    selectedDate,
    setSelectedDate,
    isBookingOpen,
    setIsBookingOpen,
    onSubmit,
    isDateUnavailable,
  } = useBookingForm();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <ArtistHeader onBookingClick={() => setIsBookingOpen(true)} />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            <ArtistAbout />
            <ArtistMedia />
            <ArtistTourDates />
            <ArtistExperience />
            <ArtistServices />
            <ArtistGallery />
            <ArtistTestimonials />
          </div>

          <div className="lg:col-span-1">
            <ArtistSidebar onBookingClick={() => setIsBookingOpen(true)} />
          </div>
        </div>
      </div>
      
      <ArtistFooter />
      
      <div className="fixed bottom-8 right-8 md:hidden z-40">
        <Button 
          onClick={() => setIsBookingOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
        >
          <CalendarIcon size={24} />
        </Button>
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gotham-bold">Book Sarah Johnson</DialogTitle>
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
  );
};

export default ArtistProfile;
