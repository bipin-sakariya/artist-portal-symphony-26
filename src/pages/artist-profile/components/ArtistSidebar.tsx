
import React from "react";
import { Instagram, Music } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { artistData } from "../data";
import { useIsMobile } from "@/hooks/use-mobile";

type ArtistSidebarProps = {
  onBookingClick: () => void;
};

const ArtistSidebar: React.FC<ArtistSidebarProps> = ({ onBookingClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "space-y-4" : "sticky top-8 space-y-8"}>
      <Card className="bg-[#181818] border-gray-800 overflow-hidden animate-fade-in">
        <div className="h-2 bg-orange-500"></div>
        <CardContent className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
          <h2 className="text-xl sm:text-2xl font-gotham-bold text-center text-white">Ready to Book?</h2>
          <p className="text-gray-400 text-center text-sm sm:text-base">
            Let Sarah create a memorable experience for your event
          </p>
          <Button 
            onClick={onBookingClick} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-6 font-gotham-bold text-base sm:text-lg"
          >
            Book Now
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#181818] border-gray-800 animate-fade-in">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-gotham-bold text-white">Follow Sarah</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <a 
              href={`https://instagram.com/${artistData.socialLinks.instagram}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-[#121212] text-white hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
            >
              <Instagram size={isMobile ? 20 : 24} />
              <span className="font-gotham-book text-sm sm:text-base">@{artistData.socialLinks.instagram}</span>
            </a>
            
            <a 
              href={`https://tiktok.com/@${artistData.socialLinks.tiktok}`} 
              target="_blank"
              rel="noreferrer" 
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-[#121212] text-white hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
              <span className="font-gotham-book text-sm sm:text-base">@{artistData.socialLinks.tiktok}</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistSidebar;
