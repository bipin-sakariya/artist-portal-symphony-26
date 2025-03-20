
import { useLanguage } from "@/hooks/use-language";
import { Artist } from "@/lib/dashboard-data";
import { CheckCircle, ChevronRight, Edit, Star, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  artist: Artist;
  onClick?: (artist: Artist) => void;
}

const ArtistCard = ({ artist, onClick }: ArtistCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/artists/edit/${artist.id}`);
  };

  const handleCardClick = () => {
    navigate(`/artists/edit/${artist.id}`);
    
    if (onClick) {
      onClick(artist);
    }
  };

  return (
    <div 
      className="glass-card overflow-hidden transition-all hover:shadow-elevated cursor-pointer group" 
      onClick={handleCardClick}
    >
      <div className="h-32 overflow-hidden relative">
        <img
          src={artist.coverImage}
          alt={language === "ar" ? artist.nameAr : artist.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {artist.isPromoted && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1 px-2">
            <Star className="h-3 w-3" />
            {t("Featured", "مميز")}
          </Badge>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
          <Badge variant="outline" className={cn(
            "font-normal text-xs flex items-center gap-1 border-0",
            getStatusColor(artist.approvalStatus)
          )}>
            {getStatusIcon(artist.approvalStatus)}
            {t(
              artist.approvalStatus.charAt(0).toUpperCase() + artist.approvalStatus.slice(1),
              artist.approvalStatus === "approved" ? "معتمد" : 
              artist.approvalStatus === "pending" ? "قيد الانتظار" : "مرفوض"
            )}
          </Badge>
          
          <Badge variant="outline" className="text-xs bg-white/20 backdrop-blur-sm border-0 text-white">
            {language === "ar" ? artist.genreAr : artist.genre}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white">
              <img
                src={artist.profileImage}
                alt={language === "ar" ? artist.nameAr : artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-medium text-base line-clamp-1">
                {language === "ar" ? artist.nameAr : artist.name}
                {artist.isVerified && (
                  <CheckCircle className="inline-block ml-1 h-3.5 w-3.5 text-primary" />
                )}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {language === "ar" ? artist.locationAr : artist.location}
              </p>
            </div>
          </div>
          
          <button 
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-3 flex items-center justify-end">
          <button className="p-1 rounded-full text-primary hover:bg-primary/5 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
