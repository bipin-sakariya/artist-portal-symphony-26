
import React from "react";
import { Star } from "lucide-react";
import { artistData } from "../data";

const ArtistExperience: React.FC = () => {
  return (
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
  );
};

export default ArtistExperience;
