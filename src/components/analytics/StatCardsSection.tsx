
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import StatCard from "@/components/dashboard/StatCard";
import { Music, Percent, TicketCheck } from "lucide-react";

interface StatCardsSectionProps {
  totalBookingRequests: number;
  totalArtists: number;
  confirmedBookingRequests: number;
}

const StatCardsSection = ({ 
  totalBookingRequests, 
  totalArtists, 
  confirmedBookingRequests 
}: StatCardsSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title={t("Total Booking Requests", "إجمالي طلبات الحجز")}
        value={totalBookingRequests}
        icon={TicketCheck}
      />
      
      <StatCard 
        title={t("Total Artists", "إجمالي الفنانين")}
        value={totalArtists}
        icon={Music}
      />
      
      <StatCard 
        title={t("Confirmation Rate", "معدل التأكيد")}
        value={`${Math.round((confirmedBookingRequests / totalBookingRequests) * 100)}%`}
        icon={Percent}
      />
    </div>
  );
};

export default StatCardsSection;
