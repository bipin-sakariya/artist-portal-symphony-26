
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import ArtistCard from "@/components/dashboard/ArtistCard";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { Artist, artists as mockArtists } from "@/lib/dashboard-data";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const ARTISTS_PER_PAGE = 8;

const Artists = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromQuery || "all");
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(mockArtists);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
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
    }
    
    setFilteredArtists(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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

  // Pagination logic
  const totalPages = Math.ceil(filteredArtists.length / ARTISTS_PER_PAGE);
  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * ARTISTS_PER_PAGE,
    currentPage * ARTISTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex w-full">
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
        
        <PageTransition>
          <main className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-1">{t("Artist Management", "")}</h2>
                <p className="text-muted-foreground">
                  {t("Manage all artists on the platform", "")}
                </p>
              </div>
              
              <Button 
                className="flex items-center gap-1 self-start sm:self-auto" 
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
              <TabsList className="overflow-x-auto min-w-max">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">{t("All Artists", "")}</TabsTrigger>
                <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3">{t("Approved", "")}</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3">{t("Pending", "")}</TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 sm:px-3">{t("Rejected", "")}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredArtists.length === 0 ? (
              <div className="glass-card p-8 sm:p-12 text-center">
                <p className="text-muted-foreground">
                  {t("No artists found matching your criteria", "")}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedArtists.map((artist) => (
                    <ArtistCard 
                      key={artist.id} 
                      artist={artist} 
                      onClick={handleSelectArtist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          // Add ellipsis if pages are skipped
                          if (index > 0 && array[index - 1] !== page - 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink
                                    isActive={page === currentPage}
                                    onClick={() => handlePageChange(page)}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                            );
                          }
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Artists;
