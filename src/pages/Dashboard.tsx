
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
import { Calendar, Music, RefreshCw, TicketCheck, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  useEffect(() => {
    // Set document title
    document.title = "Dashboard | Artist Booking Platform";
    
    // Add event listener to track sidebar state changes in localStorage
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState) {
        setIsCollapsed(JSON.parse(savedState));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes directly every 500ms (for same-window changes)
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

  // Get numbers for the cards
  const pendingNewArtists = artists.filter(a => a.isNewArtist && a.approvalStatus === "pending").length;
  const pendingUpdates = artists.filter(a => a.hasUpdateRequest && a.approvalStatus !== "rejected").length;

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-72'} ${isCollapsed ? 'max-w-[calc(100%-4rem)]' : 'max-w-[calc(100%-18rem)]'}`}>
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 font-display tracking-tight">{t("Overview", "")}</h2>
            </div>
            
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-4"} gap-4 mb-8`}>
              <StatCard 
                title={t("Total Booking Requests", "")}
                value={analyticsDashboard.totalBookingRequests}
                icon={TicketCheck}
              />
              
              <StatCard 
                title={t("Pending Approvals", "")}
                value={analyticsDashboard.pendingBookingRequests}
                icon={Calendar}
                valueClassName="text-yellow-500"
              />
              
              <StatCard 
                title={t("Total Artists", "")}
                value={analyticsDashboard.totalArtists}
                icon={Music}
              />
              
              <StatCard 
                title={t("Active Users", "")}
                value={analyticsDashboard.activeUsers}
                icon={Users}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{t("Recent Booking Requests", "")}</h3>
                  <Button variant="ghost" size="sm" className="font-display">{t("View All", "")}</Button>
                </div>
                
                <div className="space-y-5">
                  {bookingRequests.slice(0, 3).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{t("Featured Artists", "")}</h3>
                  <Button variant="ghost" size="sm" className="font-display">{t("View All", "")}</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {artists.filter(a => a.isPromoted).slice(0, 2).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingNewArtists > 0 && (
                    <div className="glass-card p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 backdrop-blur-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center">
                          <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-medium">{t("New Artist Requests", "طلبات الفنانين الجدد")}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t("You have", "")} {pendingNewArtists} {pendingNewArtists === 1 ? 
                              t("new artist pending approval", "") : 
                              t("new artists pending approval", "")}
                          </p>
                        </div>
                      </div>
                      
                      <Link to="/artists?tab=new">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 font-display">
                          {t("Review New Artists", "مراجعة الفنانين الجدد")}
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {pendingUpdates > 0 && (
                    <div className="glass-card p-5 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 backdrop-blur-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center">
                          <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-medium">{t("Artist Update Requests", "طلبات تحديث الفنانين")}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t("You have", "")} {pendingUpdates} {pendingUpdates === 1 ? 
                              t("artist update pending approval", "") : 
                              t("artist updates pending approval", "")}
                          </p>
                        </div>
                      </div>
                      
                      <Link to="/artists?tab=updates">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 font-display">
                          {t("Review Updates", "مراجعة التحديثات")}
                        </Button>
                      </Link>
                    </div>
                  )}
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
