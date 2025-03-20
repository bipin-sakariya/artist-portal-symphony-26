
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { BookingRequest } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ArtistBookingCardProps {
  booking: BookingRequest;
  onClick?: (booking: BookingRequest) => void;
}

const ArtistBookingCard = ({ booking, onClick }: ArtistBookingCardProps) => {
  const { t, language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(booking);
    }
    setIsDialogOpen(true);
  };

  const displayAmount = () => {
    const amounts = [70000, 80000, 100000];
    const index = booking.id.charCodeAt(0) % amounts.length;
    return `$${amounts[index].toLocaleString()}`;
  };

  return (
    <>
      <div 
        className="glass-card p-4 hover:shadow-elevated cursor-pointer transition-all"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <Badge className={cn(
              "mb-2 font-normal",
              getStatusColor(booking.status)
            )}>
              {t(
                booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
                booking.status === "approved" ? "معتمد" : "مكتمل"
              )}
            </Badge>
            
            <h3 className="font-semibold">
              {language === 'ar' ? booking.artistNameAr : booking.artistName}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {booking.customerName}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-semibold">
              {displayAmount()}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Booking ID: ", "رقم الحجز: ")}#{booking.id}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span>{formatDate(booking.eventDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>
              {booking.duration} {t("hours", "ساعات")}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary/70" />
            <span className="line-clamp-1">
              {language === 'ar' ? booking.eventLocationAr : booking.eventLocation}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary/70" />
            <span>
              {booking.capacity} {t("attendees", "الحضور")}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <Badge variant="outline" className="font-normal">
            {t(
              booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1),
              booking.eventType === "private" ? "خاص" : 
              booking.eventType === "corporate" ? "شركة" : 
              booking.eventType === "festival" ? "مهرجان" : "تذاكر"
            )}
          </Badge>
          
          <p className="text-xs text-muted-foreground">
            {t("Created: ", "تم الإنشاء: ")}{formatDate(booking.createdAt)}
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Booking Details", "تفاصيل الحجز")}</DialogTitle>
            <DialogDescription>
              {t(
                "View complete details for this booking",
                "عرض التفاصيل الكاملة لهذا الحجز"
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={cn(
                  "mb-2 font-normal",
                  getStatusColor(booking.status)
                )}>
                  {t(
                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
                    booking.status === "approved" ? "معتمد" : "مكتمل"
                  )}
                </Badge>
                
                <h2 className="text-xl font-semibold">
                  {booking.customerName}
                </h2>
                
                <p className="text-sm text-muted-foreground">
                  {t("Booking ID: ", "رقم الحجز: ")}<span className="font-mono">{booking.id}</span>
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold">
                  {displayAmount()}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  {t("Created: ", "تم الإنشاء: ")}{formatDate(booking.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">{t("Event Details", "تفاصيل الحدث")}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/70" />
                    <span className="text-sm">{formatDate(booking.eventDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span className="text-sm">
                      {booking.duration} {t("hours", "ساعات")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="text-sm">
                      {language === 'ar' ? booking.eventLocationAr : booking.eventLocation}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <span className="text-sm">
                      {booking.capacity} {t("attendees", "الحضور")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">{t("Event Type", "نوع الحدث")}</h3>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="font-normal">
                    {t(
                      booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1),
                      booking.eventType === "private" ? "خاص" : 
                      booking.eventType === "corporate" ? "شركة" : 
                      booking.eventType === "festival" ? "مهرجان" : "تذاكر"
                    )}
                  </Badge>
                  
                  <p className="text-sm mt-4">
                    {t(
                      "Information about the event and requirements will be shared with you closer to the date.",
                      "سيتم مشاركة معلومات حول الحدث والمتطلبات معك قبل الموعد."
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer buttons section has been removed */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistBookingCard;
