import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { BookingRequest } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Mail,
  Calendar as CalendarIcon,
  Check,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingDetailsDialogProps {
  booking: BookingRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => void;
}

const BookingDetailsDialog = ({
  booking,
  isOpen,
  onOpenChange,
  onStatusChange,
}: BookingDetailsDialogProps) => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'completed'>(booking.status);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const handleApprove = () => {
    setStatus("approved");
    if (onStatusChange) {
      onStatusChange("approved");
    }
    toast.success(t("Booking approved", "تم قبول الحجز"));
  };

  const handleReject = () => {
    setStatus("rejected");
    if (onStatusChange) {
      onStatusChange("rejected");
    }
    toast.success(t("Booking rejected", "تم رفض الحجز"));
  };

  const handleComplete = () => {
    setStatus("completed");
    if (onStatusChange) {
      onStatusChange("completed");
    }
    toast.success(t("Booking marked as completed", "تم تحديد الحجز كمكتمل"));
  };

  const displayAmount = () => {
    const amounts = [70000, 80000, 100000];
    const index = booking.id.charCodeAt(0) % amounts.length;
    return `$${amounts[index].toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t("Booking Details", "تفاصيل الحجز")} - #{booking.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge
                className={cn("mb-2 font-normal", getStatusColor(status))}
              >
                {t(
                  status.charAt(0).toUpperCase() + status.slice(1),
                  status === "approved" ? "معتمد" :
                    status === "pending" ? "قيد الانتظار" :
                      status === "rejected" ? "مرفوض" : "مكتمل"
                )}
              </Badge>

              <h3 className="text-lg font-bold">
                {language === "ar" ? booking.artistNameAr : booking.artistName}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {displayAmount()}
              </p>
              <Badge variant="outline" className="font-normal">
                {t(
                  booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1),
                  booking.eventType === "private" ? "خاص" :
                    booking.eventType === "corporate" ? "شركة" :
                      booking.eventType === "festival" ? "مهرجان" : "تذاكر"
                )}
              </Badge>
            </div>
          </div>

          <Card className="border-muted">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {t("Customer Information", "معلومات العميل")}
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/70" />
                  <span>{booking.customerName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary/70" />
                  <span>{booking.customerEmail}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary/70" />
                  <span>{t("Created on", "تم الإنشاء في")}: {formatDate(booking.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {t("Event Details", "تفاصيل الحدث")}
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/70" />
                    <span>{formatShortDate(booking.eventDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>
                      {booking.duration} {t("hours", "ساعات")}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span>
                      {language === "ar" ? booking.eventLocationAr : booking.eventLocation}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <span>
                      {booking.capacity} {t("attendees", "الحضور")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {booking.specialRequirements && (
            <Card className="border-muted">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  {t("Special Requirements", "متطلبات خاصة")}
                </h4>
                <p className="text-sm">{booking.specialRequirements}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="sm:justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {status === "pending" && (
              <>
                <Button 
                  onClick={handleApprove} 
                  variant="default"
                  className="gap-1"
                >
                  <Check className="h-4 w-4" />
                  {t("Approve", "قبول")}
                </Button>
                <Button 
                  onClick={handleReject} 
                  variant="destructive"
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  {t("Reject", "رفض")}
                </Button>
              </>
            )}
            {status === "approved" && (
              <Button 
                onClick={handleComplete} 
                variant="default"
              >
                {t("Mark as Completed", "تحديد كمكتمل")}
              </Button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t("Close", "إغلاق")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
