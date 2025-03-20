
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusMetricsCardsProps {
  bookingStatus: {
    totalBookingRequests: number;
    pendingBookingRequests: number;
    confirmedBookingRequests: number;
    rejectedBookingRequests: number;
  };
  artistStatus: {
    totalArtists: number;
    pendingArtistApprovals: number;
  };
}

const StatusMetricsCards = ({ bookingStatus, artistStatus }: StatusMetricsCardsProps) => {
  const { t } = useLanguage();

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Booking Status", "حالة الحجز")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Pending", "قيد الانتظار")}</span>
              <span className="font-medium">{bookingStatus.pendingBookingRequests}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(bookingStatus.pendingBookingRequests / bookingStatus.totalBookingRequests) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Confirmed", "مؤكد")}</span>
              <span className="font-medium">{bookingStatus.confirmedBookingRequests}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(bookingStatus.confirmedBookingRequests / bookingStatus.totalBookingRequests) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Rejected", "مرفوض")}</span>
              <span className="font-medium">{bookingStatus.rejectedBookingRequests}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(bookingStatus.rejectedBookingRequests / bookingStatus.totalBookingRequests) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Artist Approvals", "موافقات الفنانين")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Approved", "معتمد")}</span>
              <span className="font-medium">{artistStatus.totalArtists - artistStatus.pendingArtistApprovals}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${((artistStatus.totalArtists - artistStatus.pendingArtistApprovals) / artistStatus.totalArtists) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Pending", "قيد الانتظار")}</span>
              <span className="font-medium">{artistStatus.pendingArtistApprovals}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(artistStatus.pendingArtistApprovals / artistStatus.totalArtists) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusMetricsCards;
