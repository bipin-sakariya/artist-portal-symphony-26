import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import ArtistCard from "@/components/dashboard/ArtistCard";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { useLanguage } from "@/hooks/use-language";
import { Artist, artists as mockArtists } from "@/lib/dashboard-data";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Artists = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromQuery || "all");
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(mockArtists);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  // Count pending artists
  const pendingCount = artists.filter(a => a.approvalStatus === "pending").length;
  
  useEffect(() => {
    // Set document title
    document.title = "Artists Management | Artist Booking Platform";
  }, []);
  
  // Update activeTab when URL query parameter changes
  useEffect(() => {
    if (tabFromQuery && ['all', 'approved', 'pending', 'rejected'].includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);
  
  useEffect(() => {
    // Apply filters and search
    let filtered = [...artists];
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(artist => artist.approvalStatus === activeTab);
    }
    
    // Apply search
    if (searchValue) {
      const lowerCaseSearch = searchValue.toLowerCase();
      filtered = filtered.filter(artist => 
        artist.name.toLowerCase().includes(lowerCaseSearch) || 
        artist.genre.toLowerCase().includes(lowerCaseSearch) ||
        artist.location.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply additional filters
    if (Object.keys(activeFilters).length) {
      if (activeFilters.genre?.length) {
        filtered = filtered.filter(artist => activeFilters.genre.includes(artist.genre.toLowerCase()));
      }
      
      if (activeFilters.international?.length) {
        filtered = filtered.filter(artist => 
          (activeFilters.international.includes("international") && artist.isInternational) ||
          (activeFilters.international.includes("local") && !artist.isInternational)
        );
      }
      
      if (activeFilters.promotion?.length) {
        filtered = filtered.filter(artist => 
          (activeFilters.promotion.includes("promoted") && artist.isPromoted) ||
          (activeFilters.promotion.includes("regular") && !artist.isPromoted)
        );
      }
      
      if (activeFilters.requestType?.length) {
        filtered = filtered.filter(artist => 
          (activeFilters.requestType.includes("new") && artist.isNewArtist) ||
          (activeFilters.requestType.includes("update") && artist.hasUpdateRequest)
        );
      }
    }
    
    setFilteredArtists(filtered);
  }, [artists, activeTab, searchValue, activeFilters]);
  
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };
  
  const handleSelectArtist = (artist: Artist) => {
    toast.info(`Selected artist: ${artist.name}`);
  };
  
  const handleAddArtist = () => {
    toast.info("Add new artist functionality to be implemented");
  };
  
  // Filter configurations
  const filterOptions = {
    genre: {
      label: "Genre",
      labelAr: "النوع",
      options: [
        { value: "jazz fusion", label: "Jazz Fusion", labelAr: "جاز فيوجن" },
        { value: "arabic pop", label: "Arabic Pop", labelAr: "بوب عربي" },
        { value: "oud master", label: "Oud Master", labelAr: "أستاذ العود" },
        { value: "electronic", label: "Electronic", labelAr: "إلكترونية" },
        { value: "folk band", label: "Folk Band", labelAr: "فرقة فولك" },
        { value: "alternative rock", label: "Alternative Rock", labelAr: "روك بديل" },
        { value: "classic arabic", label: "Classic Arabic", labelAr: "عربي كلاسيكي" },
      ]
    },
    international: {
      label: "Artist Type",
      labelAr: "نوع الفنان",
      options: [
        { value: "international", label: "International", labelAr: "دولي" },
        { value: "local", label: "Local", labelAr: "محلي" },
      ]
    },
    promotion: {
      label: "Promotion",
      labelAr: "الترويج",
      options: [
        { value: "promoted", label: "Promoted", labelAr: "مروج" },
        { value: "regular", label: "Regular", labelAr: "عادي" },
      ]
    },
    requestType: {
      label: "Request Type",
      labelAr: "نوع الطلب",
      options: [
        { value: "new", label: "New Artist", labelAr: "فنان جديد" },
        { value: "update", label: "Profile Update", labelAr: "تحديث الملف" },
      ]
    }
  };

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL query parameter
    const newUrl = new URL(window.location.href);
    if (value === "all") {
      newUrl.searchParams.delete('tab');
    } else {
      newUrl.searchParams.set('tab', value);
    }
    window.history.pushState({}, '', newUrl.toString());
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300" 
        style={{
          marginLeft: localStorage.getItem('sidebarCollapsed') === 'true' ? '4rem' : '18rem',
          maxWidth: localStorage.getItem('sidebarCollapsed') === 'true' ? 'calc(100% - 4rem)' : 'calc(100% - 18rem)'
        }}>
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">{t("Artist Management", "")}</h2>
                <p className="text-muted-foreground">
                  {t("Manage all artists on the platform", "")}
                </p>
              </div>
              
              <Button 
                className="flex items-center gap-1" 
                onClick={handleAddArtist}
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t("Add New Artist", "")}</span>
              </Button>
            </div>
            
            <div className="mb-6">
              <SearchFilter 
                placeholder={t("Search artists by name, genre, location...", "")}
                onChange={handleSearchChange}
                onFilter={handleFilterChange}
                filters={filterOptions}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="mb-6"
            >
              <TabsList className="mb-2">
                <TabsTrigger value="all">{t("All Artists", "")}</TabsTrigger>
                <TabsTrigger value="approved">{t("Approved", "")}</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  {t("Pending", "")}
                  {pendingCount > 0 && (
                    <Badge className="ml-2 bg-purple-500">{pendingCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rejected">{t("Rejected", "")}</TabsTrigger>
              </TabsList>
              
              <div className="py-1 px-2 mb-4 bg-muted/50 rounded-md text-xs text-muted-foreground">
                {activeTab === "all" && t("Showing all artists regardless of status", "")}
                {activeTab === "approved" && t("Showing only approved artists", "")}
                {activeTab === "pending" && t("Showing artists awaiting approval (new artists and profile updates)", "")}
                {activeTab === "rejected" && t("Showing rejected artist applications", "")}
              </div>
            </Tabs>
            
            {filteredArtists.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">
                  {t("No artists found matching your criteria", "")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard 
                    key={artist.id} 
                    artist={artist} 
                    onClick={handleSelectArtist}
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

export default Artists;
