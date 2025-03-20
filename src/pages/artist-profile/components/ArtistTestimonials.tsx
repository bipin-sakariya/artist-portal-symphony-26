
import React from "react";
import { Card, CardContent } from "@/components/ui";
import { artistData } from "../data";

const ArtistTestimonials: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-gotham-bold mb-6 border-b border-orange-500/30 pb-2">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {artistData.testimonials.map((testimonial, idx) => (
          <Card key={idx} className="bg-[#181818] border-gray-800 transition-transform hover:translate-y-[-5px]">
            <CardContent className="p-8">
              <p className="text-gray-300 italic mb-6 text-lg">"{testimonial.text}"</p>
              <div>
                <p className="font-gotham-bold text-white">{testimonial.name}</p>
                <p className="text-orange-400 text-sm">{testimonial.event}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArtistTestimonials;
