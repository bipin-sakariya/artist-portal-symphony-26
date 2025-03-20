import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Palette,
  User,
  ChevronsRight
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    // Apply dark mode class to document and save to localStorage
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Save sidebar state to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    toast.success(isCollapsed ? "Sidebar expanded" : "Sidebar collapsed", { position: "bottom-right", duration: 2000 });
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
            : isCollapsed 
              ? "w-16" 
              : "w-72",
          className
        )}
      >
        <div className={cn(
          "p-6 flex items-center justify-between gap-2 border-b",
          isCollapsed && "p-3 justify-center"
        )}>
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-gotham-bold">AMP</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-gotham-bold text-sidebar-foreground">AMP</span>
                <span className="text-xs text-muted-foreground">Admin Portal</span>
              </div>
            )}
          </Link>
        </div>

        <nav className={cn(
          "flex-1 overflow-y-auto py-6",
          isCollapsed ? "px-1" : "px-3"
        )}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-colors",
                    isCollapsed ? "justify-center px-3 py-3" : "px-3 py-2",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    location.pathname === item.path 
                      ? "bg-sidebar-accent text-primary font-medium" 
                      : "text-sidebar-foreground",
                    "group relative overflow-hidden"
                  )}
                  title={isCollapsed ? item.nameEn : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="font-gotham-book">{language === "ar" ? item.nameAr : item.nameEn}</span>
                  )}
                  
                  {location.pathname === item.path && (
                    <span className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cn(
          "border-t",
          isCollapsed ? "p-2 space-y-2" : "p-4 space-y-3"
        )}>
          <button 
            onClick={toggleCollapse} 
            className={cn(
              "w-full flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-sidebar-accent",
              isCollapsed ? "mb-1" : "mb-2"
            )}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronsRight 
              className={cn(
                "h-5 w-5 text-sidebar-foreground transition-transform duration-300",
                isCollapsed ? (isRTL ? "rotate-180" : "") : (isRTL ? "" : "rotate-180")
              )} 
            />
          </button>
          
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-gotham-book">Dark Mode</span>
                {isDarkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              </div>
            )}
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleDarkMode} 
              className={isCollapsed ? "mx-auto" : ""} 
              aria-label="Toggle dark mode"
            />
          </div>
          
          {!isCollapsed && (
            <>
              {/* Artist Profile Link */}
              <Link 
                to="/artist-profile" 
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-gotham-book rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{language === "ar" ? "صفحة الفنان" : "Artist Profile"}</span>
              </Link>
              
              {/* Artist Dashboard Link */}
              <Link 
                to="/artist-dashboard" 
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-gotham-book rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Palette className="h-4 w-4" />
                <span>{language === "ar" ? "لوحة تحكم الفنان" : "Artist Dashboard"}</span>
              </Link>
            </>
          )}
          
          {isCollapsed ? (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/artist-profile" 
                className="flex justify-center w-full items-center p-2 text-sm font-gotham-book rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                title="Artist Profile"
              >
                <User className="h-4 w-4" />
              </Link>
              
              <Link 
                to="/artist-dashboard" 
                className="flex justify-center w-full items-center p-2 text-sm font-gotham-book rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                title="Artist Dashboard"
              >
                <Palette className="h-4 w-4" />
              </Link>
              
              <button 
                className="flex justify-center w-full items-center p-2 text-sm font-gotham-book rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm font-gotham-book rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
