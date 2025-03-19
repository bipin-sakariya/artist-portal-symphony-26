
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      nameEn: "Dashboard",
      nameAr: "لوحة التحكم",
      path: "/dashboard"
    },
    {
      icon: Users,
      nameEn: "Artists",
      nameAr: "الفنانين",
      path: "/artists"
    },
    {
      icon: Calendar,
      nameEn: "Bookings",
      nameAr: "الحجوزات",
      path: "/bookings"
    },
    {
      icon: BarChart3,
      nameEn: "Analytics",
      nameAr: "التحليلات",
      path: "/analytics"
    },
    {
      icon: Settings,
      nameEn: "Settings",
      nameAr: "الإعدادات",
      path: "/settings"
    }
  ];

  // Mobile menu button
  const MenuButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      aria-label={isOpen ? "Close Menu" : "Open Menu"}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  return (
    <>
      {isMobile && <MenuButton />}
      
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity",
          isMobile ? (isOpen ? "opacity-100" : "opacity-0 pointer-events-none") : "hidden",
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          "h-screen fixed top-0 bottom-0 z-40",
          isRTL ? "right-0" : "left-0",
          "border-r bg-sidebar flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isMobile 
            ? (isOpen ? "w-72 translate-x-0" : `w-72 ${isRTL ? "translate-x-full" : "-translate-x-full"}`) 
            : "w-72",
          className
        )}
      >
        <div className="p-6 flex items-center justify-between gap-2 border-b">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">MA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">{t("Music Artists", "فنانون")}</span>
              <span className="text-xs text-muted-foreground">{t("Admin Portal", "بوابة المشرف")}</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    location.pathname === item.path 
                      ? "bg-sidebar-accent text-primary font-medium" 
                      : "text-sidebar-foreground",
                    "group relative overflow-hidden"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{t(item.nameEn, item.nameAr)}</span>
                  
                  {location.pathname === item.path && (
                    <span className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("Dark Mode", "الوضع الداكن")}</span>
              {isDarkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("Language", "اللغة")}</span>
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs rounded-md border hover:bg-sidebar-accent transition-colors"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" />
            <span>{t("Log Out", "تسجيل الخروج")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
