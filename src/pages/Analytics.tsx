
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import { useLanguage } from "@/hooks/use-language";
import { analyticsDashboard } from "@/lib/dashboard-data";

// Import new refactored components
import StatCardsSection from "@/components/analytics/StatCardsSection";
import BookingTrendsChart from "@/components/analytics/BookingTrendsChart";
import GenreDistributionChart from "@/components/analytics/GenreDistributionChart";
import TopArtistsChart from "@/components/analytics/TopArtistsChart";
import StatusMetricsCards from "@/components/analytics/StatusMetricsCards";
import RevenueSourceChart from "@/components/analytics/RevenueSourceChart";

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
            
            {/* Stats Cards Section */}
            <StatCardsSection 
              totalBookingRequests={analyticsDashboard.totalBookingRequests}
              totalArtists={analyticsDashboard.totalArtists}
              confirmedBookingRequests={analyticsDashboard.confirmedBookingRequests}
            />
            
            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <BookingTrendsChart data={analyticsDashboard.bookingTrend} />
              <GenreDistributionChart data={genreData} />
            </div>
            
            {/* Top Artists Chart */}
            <div className="mb-8">
              <TopArtistsChart data={artistData} />
            </div>
            
            {/* Bottom Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusMetricsCards 
                bookingStatus={{
                  totalBookingRequests: analyticsDashboard.totalBookingRequests,
                  pendingBookingRequests: analyticsDashboard.pendingBookingRequests,
                  confirmedBookingRequests: analyticsDashboard.confirmedBookingRequests,
                  rejectedBookingRequests: analyticsDashboard.rejectedBookingRequests
                }}
                artistStatus={{
                  totalArtists: analyticsDashboard.totalArtists,
                  pendingArtistApprovals: analyticsDashboard.pendingArtistApprovals
                }}
              />
              <RevenueSourceChart />
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Analytics;
