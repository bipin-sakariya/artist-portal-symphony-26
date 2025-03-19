
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import StatCard from "@/components/dashboard/StatCard";
import { useLanguage } from "@/hooks/use-language";
import { analyticsDashboard } from "@/lib/dashboard-data";
import { 
  AreaChart, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Music, 
  Percent, 
  TicketCheck, 
  Users 
} from "lucide-react";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend,
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  const { t, language } = useLanguage();
  
  useEffect(() => {
    // Set document title
    document.title = "Analytics & Insights | Artist Booking Platform";
  }, []);
  
  // Data transformations
  const genreData = analyticsDashboard.mostRequestedGenres.map(genre => ({
    name: language === 'ar' ? genre.genreAr : genre.genre,
    value: genre.count
  }));
  
  const artistData = analyticsDashboard.topArtists.map(artist => ({
    name: language === 'ar' ? artist.nameAr : artist.name,
    bookings: artist.bookings,
    revenue: artist.revenue
  }));
  
  // Colors for pie chart
  const GENRE_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">{t("Analytics & Insights", "التحليلات والرؤى")}</h2>
              <p className="text-muted-foreground">
                {t("View performance metrics and insights", "عرض مقاييس الأداء والرؤى")}
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
                title={t("Total Artists", "إجمالي الفنانين")}
                value={analyticsDashboard.totalArtists}
                icon={Music}
                trend={{ value: 5, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
              />
              
              <StatCard 
                title={t("Confirmation Rate", "معدل التأكيد")}
                value={`${Math.round((analyticsDashboard.confirmedBookingRequests / analyticsDashboard.totalBookingRequests) * 100)}%`}
                icon={Percent}
                trend={{ value: 8, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
              />
              
              <StatCard 
                title={t("Total Revenue", "إجمالي الإيرادات")}
                value={`${analyticsDashboard.totalRevenue.toLocaleString()} ${analyticsDashboard.currency}`}
                icon={DollarSign}
                trend={{ value: 18, isPositive: true }}
                description={t("since last month", "منذ الشهر الماضي")}
                valueClassName="text-primary"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Booking Trends", "اتجاهات الحجز")}</CardTitle>
                  <CardDescription>
                    {t("Monthly booking request volume", "حجم طلبات الحجز الشهرية")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsAreaChart
                        data={analyticsDashboard.bookingTrend}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
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
                          name={t("Booking Requests", "طلبات الحجز")}
                        />
                      </RechartsAreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("Most Requested Genres", "الأنواع الأكثر طلبًا")}</CardTitle>
                  <CardDescription>
                    {t("Distribution of booking requests by genre", "توزيع طلبات الحجز حسب النوع")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genreData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {genreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} ${t("bookings", "حجوزات")}`, t("Count", "العدد")]}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t("Top Performing Artists", "أفضل الفنانين أداءً")}</CardTitle>
                <CardDescription>
                  {t("Artists with the highest bookings and revenue", "الفنانون ذوو الحجوزات والإيرادات الأعلى")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={artistData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tick={{ 
                          fill: 'hsl(var(--muted-foreground))',
                          textAnchor: 'end',
                          dy: 20,
                          transform: 'rotate(-45)' 
                        }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: 20
                        }}
                      />
                      <Bar 
                        yAxisId="left" 
                        dataKey="bookings" 
                        name={t("Bookings", "الحجوزات")}
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="revenue" 
                        name={t("Revenue (USD)", "الإيرادات (دولار أمريكي)")}
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("Booking Status", "حالة الحجز")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Pending", "قيد الانتظار")}</span>
                      <span className="font-medium">{analyticsDashboard.pendingBookingRequests}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${(analyticsDashboard.pendingBookingRequests / analyticsDashboard.totalBookingRequests) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Confirmed", "مؤكد")}</span>
                      <span className="font-medium">{analyticsDashboard.confirmedBookingRequests}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(analyticsDashboard.confirmedBookingRequests / analyticsDashboard.totalBookingRequests) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Rejected", "مرفوض")}</span>
                      <span className="font-medium">{analyticsDashboard.rejectedBookingRequests}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(analyticsDashboard.rejectedBookingRequests / analyticsDashboard.totalBookingRequests) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("Artist Approvals", "موافقات الفنانين")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Approved", "معتمد")}</span>
                      <span className="font-medium">{analyticsDashboard.totalArtists - analyticsDashboard.pendingArtistApprovals}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${((analyticsDashboard.totalArtists - analyticsDashboard.pendingArtistApprovals) / analyticsDashboard.totalArtists) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("Pending", "قيد الانتظار")}</span>
                      <span className="font-medium">{analyticsDashboard.pendingArtistApprovals}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${(analyticsDashboard.pendingArtistApprovals / analyticsDashboard.totalArtists) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t("Revenue Sources", "مصادر الإيرادات")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: t("Corporate", "شركات"), value: 45 },
                            { name: t("Private", "خاص"), value: 30 },
                            { name: t("Festivals", "مهرجانات"), value: 15 },
                            { name: t("Ticketed", "تذاكر"), value: 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#3498db" />
                          <Cell fill="#e74c3c" />
                          <Cell fill="#2ecc71" />
                          <Cell fill="#f39c12" />
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, t("Percentage", "النسبة المئوية")]}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-[#3498db]" />
                      <span className="text-xs text-muted-foreground">{t("Corporate", "شركات")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-[#e74c3c]" />
                      <span className="text-xs text-muted-foreground">{t("Private", "خاص")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-[#2ecc71]" />
                      <span className="text-xs text-muted-foreground">{t("Festivals", "مهرجانات")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-[#f39c12]" />
                      <span className="text-xs text-muted-foreground">{t("Ticketed", "تذاكر")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Analytics;
