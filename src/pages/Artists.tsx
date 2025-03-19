
import { useState, useEffect } from "react";
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

const Artists = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(mockArtists);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  useEffect(() => {
    // Set document title
    document.title = "Artists Management | Artist Booking Platform";
  }, []);
  
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
        artist.nameAr.includes(lowerCaseSearch) ||
        artist.genre.toLowerCase().includes(lowerCaseSearch) ||
        artist.genreAr.includes(lowerCaseSearch) ||
        artist.location.toLowerCase().includes(lowerCaseSearch) ||
        artist.locationAr.includes(lowerCaseSearch)
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
    toast.info(t(`Selected artist: ${artist.name}`, `تم اختيار الفنان: ${artist.nameAr}`));
  };
  
  const handleAddArtist = () => {
    toast.info(t("Add new artist functionality to be implemented", "سيتم تنفيذ وظيفة إضافة فنان جديد"));
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
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">{t("Artist Management", "إدارة الفنانين")}</h2>
                <p className="text-muted-foreground">
                  {t("Manage all artists on the platform", "إدارة جميع الفنانين على المنصة")}
                </p>
              </div>
              
              <Button 
                className="flex items-center gap-1" 
                onClick={handleAddArtist}
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t("Add New Artist", "إضافة فنان جديد")}</span>
              </Button>
            </div>
            
            <div className="mb-6">
              <SearchFilter 
                placeholder={t("Search artists by name, genre, location...", "البحث عن فنانين حسب الاسم أو النوع أو الموقع...")}
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
                <TabsTrigger value="all">{t("All Artists", "جميع الفنانين")}</TabsTrigger>
                <TabsTrigger value="approved">{t("Approved", "معتمد")}</TabsTrigger>
                <TabsTrigger value="pending">{t("Pending", "قيد الانتظار")}</TabsTrigger>
                <TabsTrigger value="rejected">{t("Rejected", "مرفوض")}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredArtists.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">
                  {t("No artists found matching your criteria", "لم يتم العثور على فنانين مطابقين لمعاييرك")}
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
