
import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { artistData } from "../data";
import { useIsMobile } from "@/hooks/use-mobile";

type ArtistHeaderProps = {
  onBookingClick: () => void;
};

const ArtistHeader: React.FC<ArtistHeaderProps> = ({ onBookingClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className="h-[40vh] sm:h-[50vh] md:h-[60vh] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${artistData.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#121212]"></div>
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-gotham-bold mb-2 md:mb-3 animate-fade-in">
            {artistData.name}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-orange-400 font-gotham-book mb-3 sm:mb-4 md:mb-6 animate-slide-in-left">
            {artistData.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-4 md:mb-8">
            <div className="flex items-center gap-1">
              <MapPin className="text-orange-400 h-3 w-3 sm:h-4 sm:w-4" />
              <span>{artistData.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-0">
              {artistData.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs sm:text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          
          {!isMobile && (
            <Button 
              onClick={onBookingClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-gotham-bold flex items-center gap-2 transition-all hover:translate-y-[-2px] shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Book Now
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="m12 5 7 7-7 7"></path>
                <path d="M5 12h14"></path>
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
