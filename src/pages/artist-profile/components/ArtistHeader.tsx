
import React from "react";
import { MapPin } from "lucide-react";
import { artistData } from "../data";

type ArtistHeaderProps = {
  onBookingClick: () => void;
};

const ArtistHeader: React.FC<ArtistHeaderProps> = ({ onBookingClick }) => {
  return (
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
          
          <button 
            onClick={onBookingClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-md text-lg font-gotham-bold flex items-center gap-2 transition-all transform hover:scale-105 group"
          >
            Book Now
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-1 group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
