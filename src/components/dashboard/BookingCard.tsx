
import { useLanguage } from "@/hooks/use-language";
import { BookingRequest } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import BookingDetailsDialog from "./BookingDetailsDialog";

interface BookingCardProps {
  booking: BookingRequest;
  onClick?: (booking: BookingRequest) => void;
  onStatusChange?: (bookingId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => void;
}

const BookingCard = ({ booking, onClick, onStatusChange }: BookingCardProps) => {
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
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
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

  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => {
    if (onStatusChange) {
      onStatusChange(booking.id, newStatus);
    }
  };

  // Display booking amount in USD with higher values
  const displayAmount = () => {
    // Convert the booking budget to a higher value in USD
    const amount = booking.budget * 1000; // Scaling up the amount
    return `$${amount.toLocaleString()}`;
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
                booking.status === "approved" ? "معتمد" : 
                booking.status === "pending" ? "قيد الانتظار" : 
                booking.status === "rejected" ? "مرفوض" : "مكتمل"
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

      <BookingDetailsDialog 
        booking={booking}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default BookingCard;
