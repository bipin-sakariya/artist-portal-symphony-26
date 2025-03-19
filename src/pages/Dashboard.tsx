
import { useEffect } from "react";
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

const Dashboard = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Set document title
    document.title = "Dashboard | Artist Booking Platform";
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 font-display tracking-tight">{t("Overview", "نظرة عامة")}</h2>
              <p className="text-muted-foreground">
                {t("Welcome to your artist booking platform", "مرحبًا بك في منصة حجز الفنانين")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              <StatCard 
                title={t("Total Booking Requests", "إجمالي طلبات الحجز")}
                value={analyticsDashboard.totalBookingRequests}
                icon={TicketCheck}
                trend={{ value: 12, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
              />
              
              <StatCard 
                title={t("Pending Approvals", "في انتظار الموافقات")}
                value={analyticsDashboard.pendingBookingRequests}
                icon={Calendar}
                valueClassName="text-yellow-500"
              />
              
              <StatCard 
                title={t("Total Artists", "إجمالي الفنانين")}
                value={analyticsDashboard.totalArtists}
                icon={Music}
                trend={{ value: 5, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{t("Recent Booking Requests", "طلبات الحجز الأخيرة")}</h3>
                  <Button variant="ghost" size="sm" className="font-display">{t("View All", "عرض الكل")}</Button>
                </div>
                
                <div className="space-y-5">
                  {bookingRequests.slice(0, 3).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{t("Featured Artists", "الفنانين المميزين")}</h3>
                  <Button variant="ghost" size="sm" className="font-display">{t("View All", "عرض الكل")}</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {artists.filter(a => a.isPromoted).slice(0, 2).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-medium">{t("Pending Artist Approvals", "الفنانون في انتظار الموافقة")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("You have", "لديك")} {analyticsDashboard.pendingArtistApprovals} {t("artists pending approval", "فنان في انتظار الموافقة")}
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 font-display">{t("Review Pending Artists", "مراجعة الفنانين المعلقين")}</Button>
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
