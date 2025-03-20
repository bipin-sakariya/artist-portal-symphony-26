
import React from "react";
import { Music, ExternalLink } from "lucide-react";
import { artistData } from "../data";

const ArtistMedia: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">
        Listen & Watch
      </h2>
      
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
  );
};

export default ArtistMedia;
