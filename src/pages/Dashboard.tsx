import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import ArtistCard from "@/components/dashboard/ArtistCard";
import BookingCard from "@/components/dashboard/BookingCard";
import PageTransition from "@/components/dashboard/PageTransition";
import { useLanguage } from "@/hooks/use-language";
import { analyticsDashboard, artists, bookingRequests } from "@/lib/dashboard-data";
import { Calendar, Music, TicketCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  useEffect(() => {
    document.title = "Dashboard | Artist Booking Platform";
    
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState) {
        setIsCollapsed(JSON.parse(savedState));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState && JSON.parse(savedState) !== isCollapsed) {
        setIsCollapsed(JSON.parse(savedState));
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isCollapsed]);

  const dashboardData = {
    ...analyticsDashboard,
    pendingArtistApprovals: 1
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        isMobile 
          ? "w-full ml-0" 
          : isCollapsed 
            ? "ml-16 max-w-[calc(100%-4rem)]" 
            : "ml-72 max-w-[calc(100%-18rem)]"
      )}>
        <Header />
        
        <PageTransition>
          <main className="p-4 md:p-6">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl font-semibold mb-2 font-display tracking-tight">{t("Overview", "")}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <StatCard 
                title={t("Total Booking Requests", "")}
                value={dashboardData.totalBookingRequests}
                icon={TicketCheck}
              />
              
              <StatCard 
                title={t("Pending Approvals", "")}
                value={dashboardData.pendingBookingRequests}
                icon={Calendar}
                valueClassName="text-yellow-500"
              />
              
              <StatCard 
                title={t("Total Artists", "")}
                value={dashboardData.totalArtists}
                icon={Music}
              />
              
              <StatCard 
                title={t("Active Users", "")}
                value={dashboardData.activeUsers}
                icon={Users}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base md:text-lg font-medium">{t("Recent Booking Requests", "")}</h3>
                  <Button variant="ghost" size="sm" className="font-display text-xs md:text-sm">{t("View All", "")}</Button>
                </div>
                
                <div className="space-y-3 md:space-y-5">
                  {bookingRequests.slice(0, 3).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base md:text-lg font-medium">{t("Featured Artists", "")}</h3>
                  <Button variant="ghost" size="sm" className="font-display text-xs md:text-sm">{t("View All", "")}</Button>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                    {artists.filter(a => a.isPromoted).slice(0, 2).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-4 md:p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 backdrop-blur-lg">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300 flex items-center justify-center">
                      <Users className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm md:text-base font-medium">{t("Pending Artist Approvals", "")}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {t("You have", "")} {dashboardData.pendingArtistApprovals} {t("artist pending approval", "")}
                      </p>
                    </div>
                  </div>
                  
                  <Link to="/artists?tab=pending">
                    <Button className="w-full text-sm md:text-base bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 font-display">
                      {t("Review Pending Artists", "")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Dashboard;
