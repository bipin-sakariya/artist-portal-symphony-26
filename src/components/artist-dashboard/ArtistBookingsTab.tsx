
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock } from "lucide-react";
import { BookingRequest } from "@/lib/dashboard-data";
import ArtistBookingCard from "./ArtistBookingCard";

// Mock data for artist's approved and completed bookings
const artistBookings: BookingRequest[] = [
  {
    id: "BKG-7891",
    artistName: "John Legend",
    artistNameAr: "جون ليجند",
    customerName: "Wedding Planners Co.",
    eventDate: "2024-07-15",
    eventType: "private",
    eventLocation: "Waldorf Astoria, New York",
    eventLocationAr: "فندق والدورف أستوريا، نيويورك",
    duration: 3,
    capacity: 200,
    status: "approved",
    createdAt: "2024-04-20"
  },
  {
    id: "BKG-6542",
    artistName: "John Legend",
    artistNameAr: "جون ليجند",
    customerName: "Goldman Sachs",
    eventDate: "2024-06-05",
    eventType: "corporate",
    eventLocation: "Goldman Sachs HQ, New York",
    eventLocationAr: "مقر جولدمان ساكس، نيويورك",
    duration: 2,
    capacity: 150,
    status: "approved",
    createdAt: "2024-03-10"
  },
  {
    id: "BKG-5431",
    artistName: "John Legend",
    artistNameAr: "جون ليجند",
    customerName: "Summer Music Festival",
    eventDate: "2024-01-20",
    eventType: "festival",
    eventLocation: "Central Park, New York",
    eventLocationAr: "سنترال بارك، نيويورك",
    duration: 2,
    capacity: 5000,
    status: "completed",
    createdAt: "2023-10-15"
  },
  {
    id: "BKG-4328",
    artistName: "John Legend",
    artistNameAr: "جون ليجند",
    customerName: "Microsoft Annual Conference",
    eventDate: "2023-12-10",
    eventType: "corporate",
    eventLocation: "Seattle Convention Center",
    eventLocationAr: "مركز مؤتمرات سياتل",
    duration: 1,
    capacity: 300,
    status: "completed",
    createdAt: "2023-09-01"
  },
  {
    id: "BKG-3215",
    artistName: "John Legend",
    artistNameAr: "جون ليجند",
    customerName: "Sarah & Michael",
    eventDate: "2023-11-25",
    eventType: "private",
    eventLocation: "The Plaza Hotel, New York",
    eventLocationAr: "فندق بلازا، نيويورك",
    duration: 4,
    capacity: 150,
    status: "completed",
    createdAt: "2023-08-15"
  }
];

const ArtistBookingsTab = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("approved");

  const approvedBookings = artistBookings.filter(booking => booking.status === "approved");
  const completedBookings = artistBookings.filter(booking => booking.status === "completed");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("My Bookings", "حجوزاتي")}</CardTitle>
          <CardDescription>
            {t(
              "View your approved and completed bookings",
              "عرض الحجوزات المعتمدة والمكتملة الخاصة بك"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="approved" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger 
                value="approved"
                className="flex items-center justify-center gap-2"
              >
                <Clock className="h-4 w-4" />
                <span>{t("Approved", "معتمدة")}</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {approvedBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>{t("Completed", "مكتملة")}</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {completedBookings.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="approved" className="space-y-4 pt-4">
              {approvedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold">
                    {t("No Approved Bookings", "لا توجد حجوزات معتمدة")}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    {t(
                      "You don't have any approved upcoming bookings at the moment.",
                      "ليس لديك أي حجوزات قادمة معتمدة في الوقت الحالي."
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedBookings.map((booking) => (
                    <ArtistBookingCard 
                      key={booking.id} 
                      booking={booking} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 pt-4">
              {completedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Check className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold">
                    {t("No Completed Bookings", "لا توجد حجوزات مكتملة")}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    {t(
                      "You don't have any completed bookings yet.",
                      "ليس لديك أي حجوزات مكتملة حتى الآن."
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedBookings.map((booking) => (
                    <ArtistBookingCard 
                      key={booking.id} 
                      booking={booking} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistBookingsTab;
