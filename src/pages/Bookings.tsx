import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import BookingCard from "@/components/dashboard/BookingCard";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { useLanguage } from "@/hooks/use-language";
import { BookingRequest, bookingRequests as mockBookings } from "@/lib/dashboard-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Bookings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>(mockBookings);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  useEffect(() => {
    // Set document title
    document.title = "Bookings Management | AMP";
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let filtered = [...bookings];
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(booking => booking.status === activeTab);
    }
    
    // Apply search
    if (searchValue) {
      const lowerCaseSearch = searchValue.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.artistName.toLowerCase().includes(lowerCaseSearch) || 
        booking.artistNameAr.includes(lowerCaseSearch) ||
        booking.customerName.toLowerCase().includes(lowerCaseSearch) ||
        booking.customerEmail.toLowerCase().includes(lowerCaseSearch) ||
        booking.eventLocation.toLowerCase().includes(lowerCaseSearch) ||
        booking.eventLocationAr.includes(lowerCaseSearch)
      );
    }
    
    // Apply additional filters
    if (Object.keys(activeFilters).length) {
      if (activeFilters.eventType?.length) {
        filtered = filtered.filter(booking => activeFilters.eventType.includes(booking.eventType));
      }
      
      if (activeFilters.budget?.length) {
        filtered = filtered.filter(booking => {
          if (activeFilters.budget.includes("low") && booking.budget < 5000) return true;
          if (activeFilters.budget.includes("medium") && booking.budget >= 5000 && booking.budget < 10000) return true;
          if (activeFilters.budget.includes("high") && booking.budget >= 10000) return true;
          return false;
        });
      }
    }
    
    setFilteredBookings(filtered);
  }, [bookings, activeTab, searchValue, activeFilters]);
  
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };
  
  const handleSelectBooking = (booking: BookingRequest) => {
    // This will now be handled by the BookingDetailsDialog component
  };
  
  const handleStatusChange = (bookingId: string, newStatus: string) => {
    // Update local bookings state
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? {...booking, status: newStatus} : booking
    );
    
    setBookings(updatedBookings);
  };
  
  const filterOptions = {
    eventType: {
      label: "Event Type",
      labelAr: "نوع الحدث",
      options: [
        { value: "private", label: "Private", labelAr: "خاص" },
        { value: "corporate", label: "Corporate", labelAr: "شركة" },
        { value: "festival", label: "Festival", labelAr: "مهرجان" },
        { value: "ticketed", label: "Ticketed", labelAr: "تذاكر" },
      ]
    },
    budget: {
      label: "Budget Range",
      labelAr: "نطاق الميزانية",
      options: [
        { value: "low", label: "< 5,000", labelAr: "< 5,000" },
        { value: "medium", label: "5,000 - 10,000", labelAr: "5,000 - 10,000" },
        { value: "high", label: "> 10,000", labelAr: "> 10,000" },
      ]
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("Booking Requests", "طلبات الحجز")}</h2>
              <p className="text-muted-foreground">
                {t("Manage all booking requests for your artists", "إدارة جميع طلبات الحجز للفنانين الخاصين بك")}
              </p>
            </div>
            
            <div className="my-6">
              <SearchFilter 
                placeholder={t("Search bookings by artist, customer, location...", "البحث عن الحجوزات حسب الفنان أو العميل أو الموقع...")}
                onChange={handleSearchChange}
                onFilter={handleFilterChange}
                filters={filterOptions}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="all">{t("All Bookings", "جميع الحجوزات")}</TabsTrigger>
                <TabsTrigger value="pending">{t("Pending", "قيد الانتظار")}</TabsTrigger>
                <TabsTrigger value="approved">{t("Approved", "معتمد")}</TabsTrigger>
                <TabsTrigger value="rejected">{t("Rejected", "مرفوض")}</TabsTrigger>
                <TabsTrigger value="completed">{t("Completed", "مكتمل")}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredBookings.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">
                  {t("No booking requests found matching your criteria", "لم يتم العثور على طلبات حجز مطابقة لمعاييرك")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onClick={handleSelectBooking}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Bookings;
