
import React from "react";
import { Instagram, Music } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { artistData } from "../data";

type ArtistSidebarProps = {
  onBookingClick: () => void;
};

const ArtistSidebar: React.FC<ArtistSidebarProps> = ({ onBookingClick }) => {
  return (
    <div className="sticky top-8 space-y-8">
      <Card className="bg-[#181818] border-gray-800 overflow-hidden animate-fade-in">
        <div className="h-2 bg-orange-500"></div>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-gotham-bold text-center text-white">Ready to Book?</h2>
          <p className="text-gray-400 text-center">
            Let Sarah create a memorable experience for your event
          </p>
          <Button 
            onClick={onBookingClick} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 font-gotham-bold text-lg"
          >
            Book Now
          </Button>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default ArtistSidebar;
