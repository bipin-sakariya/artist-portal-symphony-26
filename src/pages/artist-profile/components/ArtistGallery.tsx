
import React from "react";
import { artistData } from "../data";

const ArtistGallery: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artistData.galleryImages.map((img, idx) => (
          <div
            key={idx}
            className="h-64 rounded-lg overflow-hidden bg-cover bg-center transition-transform hover:scale-105"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistGallery;
