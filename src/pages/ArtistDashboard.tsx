
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, UserCog } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import ArtistProfileTab from "@/components/artist-dashboard/ArtistProfileTab";
import ArtistCalendarTab from "@/components/artist-dashboard/ArtistCalendarTab";
import ArtistBookingsTab from "@/components/artist-dashboard/ArtistBookingsTab";

const ArtistDashboard = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        isMobile 
          ? "w-full" 
          : isCollapsed 
            ? "ml-16" 
            : "ml-72"
      )}>
        <Header />
        
        <div className="flex-1 container py-4 md:py-8 px-4 md:px-6 space-y-4 md:space-y-6">
          <Tabs 
            defaultValue="profile" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="space-y-4 md:space-y-6"
          >
            <TabsList className={cn(
              "grid w-full",
              isMobile ? "grid-cols-3" : "max-w-3xl mx-auto grid-cols-3"
            )}>
              <TabsTrigger 
                value="profile"
                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:text-primary"
              >
                <UserCog className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>{t("Profile", "الملف الشخصي")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:text-primary"
              >
                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>{t("Calendar", "التقويم")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bookings"
                className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm data-[state=active]:text-primary"
              >
                <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>{t("Bookings", "الحجوزات")}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 md:space-y-6">
              <ArtistProfileTab />
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-4 md:space-y-6">
              <ArtistCalendarTab />
            </TabsContent>
            
            <TabsContent value="bookings" className="space-y-4 md:space-y-6">
              <ArtistBookingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
