
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, UserCog } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import ArtistProfileTab from "@/components/artist-dashboard/ArtistProfileTab";
import ArtistCalendarTab from "@/components/artist-dashboard/ArtistCalendarTab";
import ArtistBookingsTab from "@/components/artist-dashboard/ArtistBookingsTab";

const ArtistDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-72">
        <Header />
        
        <div className="flex-1 container py-6 md:py-8 space-y-6">
          <PageTransition>
            <Tabs 
              defaultValue="profile" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-3xl mx-auto">
                <TabsTrigger 
                  value="profile"
                  className="flex items-center justify-center gap-2 data-[state=active]:text-primary"
                >
                  <UserCog className="h-4 w-4" />
                  <span>{t("Profile", "الملف الشخصي")}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar"
                  className="flex items-center justify-center gap-2 data-[state=active]:text-primary"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{t("Calendar", "التقويم")}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="bookings"
                  className="flex items-center justify-center gap-2 data-[state=active]:text-primary"
                >
                  <Check className="h-4 w-4" />
                  <span>{t("Bookings", "الحجوزات")}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <ArtistProfileTab />
              </TabsContent>
              
              <TabsContent value="calendar" className="space-y-6">
                <ArtistCalendarTab />
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-6">
                <ArtistBookingsTab />
              </TabsContent>
            </Tabs>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
