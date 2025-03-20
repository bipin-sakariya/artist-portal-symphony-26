
import React from "react";
import { artistData } from "../data";

const ArtistAbout: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">
        About the Artist
      </h2>
      <p className="text-gray-300 font-gotham-book leading-relaxed text-lg">
        {artistData.bio}
      </p>
    </div>
  );
};

export default ArtistAbout;
