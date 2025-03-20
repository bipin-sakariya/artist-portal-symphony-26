
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [pageTitle, setPageTitle] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    // Set page title based on current route
    switch (location.pathname) {
      case "/dashboard":
        setPageTitle(t("Dashboard", "لوحة التحكم"));
        break;
      case "/artists":
        setPageTitle(t("Artists Management", "إدارة الفنانين"));
        break;
      case "/bookings":
        setPageTitle(t("Bookings Management", "إدارة الحجوزات"));
        break;
      case "/analytics":
        setPageTitle(t("Analytics & Insights", "التحليلات والرؤى"));
        break;
      case "/settings":
        setPageTitle(t("Settings", "الإعدادات"));
        break;
      default:
        setPageTitle(t("Dashboard", "لوحة التحكم"));
    }
  }, [location.pathname, t]);

  return (
    <header className="h-16 px-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className={`text-xl font-gotham-bold ${isMobile ? "ml-8" : ""}`}>
          {pageTitle}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            placeholder={t("Search...", "بحث...")}
            className="h-9 w-[200px] pl-9 pr-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary font-gotham-book"
          />
        </div>
        
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {notificationCount}
              </Badge>
            )}
          </button>
        </div>
        
        <button className="relative flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-gotham-bold">AA</span>
          </div>
          <span className="text-sm font-gotham-book hidden sm:inline-block">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
