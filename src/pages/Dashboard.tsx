
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import ArtistCard from "@/components/dashboard/ArtistCard";
import BookingCard from "@/components/dashboard/BookingCard";
import PageTransition from "@/components/dashboard/PageTransition";
import { useLanguage } from "@/hooks/use-language";
import { analyticsDashboard, artists, bookingRequests } from "@/lib/dashboard-data";
import { AreaChart, Calendar, Music, TicketCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

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
              <h2 className="text-xl font-semibold mb-2">{t("Overview", "نظرة عامة")}</h2>
              <p className="text-muted-foreground">
                {t("Welcome to your artist booking platform", "مرحبًا بك في منصة حجز الفنانين")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              
              <StatCard 
                title={t("Total Revenue", "إجمالي الإيرادات")}
                value={`${analyticsDashboard.totalRevenue.toLocaleString()} ${analyticsDashboard.currency}`}
                icon={AreaChart}
                trend={{ value: 18, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
                valueClassName="text-primary"
              />
            </div>
            
            <div className="glass-card p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{t("Booking Trends", "اتجاهات الحجز")}</h3>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart
                    data={analyticsDashboard.bookingTrend}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1}
                      fill="url(#colorCount)" 
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t("Recent Booking Requests", "طلبات الحجز الأخيرة")}</h3>
                  <Button variant="ghost" size="sm">{t("View All", "عرض الكل")}</Button>
                </div>
                
                <div className="space-y-4">
                  {bookingRequests.slice(0, 3).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t("Featured Artists", "الفنانين المميزين")}</h3>
                  <Button variant="ghost" size="sm">{t("View All", "عرض الكل")}</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {artists.filter(a => a.isPromoted).slice(0, 2).map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("Pending Artist Approvals", "الفنانون في انتظار الموافقة")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("You have", "لديك")} {analyticsDashboard.pendingArtistApprovals} {t("artists pending approval", "فنان في انتظار الموافقة")}
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full">{t("Review Pending Artists", "مراجعة الفنانين المعلقين")}</Button>
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
