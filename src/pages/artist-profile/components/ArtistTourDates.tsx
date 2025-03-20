
import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { artistData } from "../data";

const ArtistTourDates: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">
        Upcoming Tour Dates
      </h2>
      
      <div className="space-y-4">
        {artistData.tourDates.map((tour, idx) => (
          <div 
            key={idx} 
            className="bg-[#181818] rounded-lg p-6 border border-gray-800 transition-transform hover:translate-x-1 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
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
              <Button 
                variant="default" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistTourDates;
