
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [pageTitle, setPageTitle] = useState("");

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
      case "/artist-dashboard":
        setPageTitle(t("Artist Dashboard", "لوحة تحكم الفنان"));
        break;
      case "/settings":
        setPageTitle(t("Settings", "الإعدادات"));
        break;
      default:
        setPageTitle(t("Dashboard", "لوحة التحكم"));
    }
  }, [location.pathname, t]);

  return (
    <header className="h-16 px-4 md:px-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
      <div className={cn(
        "flex items-center",
        isMobile ? "justify-center w-full" : "justify-start gap-4"
      )}>
        <h1 className={cn(
          "text-lg md:text-xl font-gotham-bold",
          isMobile ? "text-center" : ""
        )}>
          {pageTitle}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
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
