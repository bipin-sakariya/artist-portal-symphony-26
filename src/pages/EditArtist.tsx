import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import PageTransition from "@/components/dashboard/PageTransition";
import { useLanguage } from "@/hooks/use-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { artists as mockArtists } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Save, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedArtist, ArtistTags, PricingMatrix } from "@/types/artist";
import { cn } from "@/lib/utils";
import BasicInfoTab from "@/components/artists/tabs/BasicInfoTab";
import MediaTab from "@/components/artists/tabs/MediaTab";
import PricingTab from "@/components/artists/tabs/PricingTab";
import SettingsTab from "@/components/artists/tabs/SettingsTab";
import AvailabilityTab from "@/components/artists/tabs/AvailabilityTab";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  nameAr: z.string().min(2, { message: "Arabic name must be at least 2 characters" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  genreAr: z.string().min(1, { message: "Arabic genre is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  locationAr: z.string().min(2, { message: "Arabic location is required" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  bioAr: z.string().min(10, { message: "Arabic bio must be at least 10 characters" }),
  isVerified: z.boolean().default(false),
  isPromoted: z.boolean().default(false),
  isInternational: z.boolean().default(false),
  approvalStatus: z.enum(["approved", "pending", "rejected"]),
  profileImage: z.string().url({ message: "Valid profile image URL is required" }),
  coverImage: z.string().url({ message: "Valid cover image URL is required" }),
  minimumBid: z.number().min(0, { message: "Minimum bid must be a positive number" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  socialLinks: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

const EditArtist = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [artist, setArtist] = useState<ExtendedArtist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<ArtistTags[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const [pricingMatrix, setPricingMatrix] = useState<PricingMatrix>({
    default: 0,
    eventTypes: {},
    countries: {},
    specific: {}
  });

  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      genre: "",
      genreAr: "",
      location: "",
      locationAr: "",
      bio: "",
      bioAr: "",
      isVerified: false,
      isPromoted: false,
      isInternational: false,
      approvalStatus: "pending",
      profileImage: "",
      coverImage: "",
      minimumBid: 0,
      currency: "SAR",
      socialLinks: {
        instagram: "",
        twitter: "",
        facebook: "",
        website: "",
      },
    },
  });

  useEffect(() => {
    if (id) {
      const foundArtist = mockArtists.find(a => a.id === id);
      
      if (foundArtist) {
        const extendedArtist = foundArtist as ExtendedArtist;
        setArtist(extendedArtist);
        
        const artistWithSocialLinks = {
          ...extendedArtist,
          socialLinks: extendedArtist.socialLinks || {
            instagram: "",
            twitter: "",
            facebook: "",
            website: "",
          }
        };
        
        form.reset({
          name: artistWithSocialLinks.name,
          nameAr: artistWithSocialLinks.nameAr,
          genre: artistWithSocialLinks.genre,
          genreAr: artistWithSocialLinks.genreAr,
          location: artistWithSocialLinks.location,
          locationAr: artistWithSocialLinks.locationAr,
          bio: artistWithSocialLinks.bio || "",
          bioAr: artistWithSocialLinks.bioAr || "",
          isVerified: artistWithSocialLinks.isVerified,
          isPromoted: artistWithSocialLinks.isPromoted,
          isInternational: artistWithSocialLinks.isInternational,
          approvalStatus: artistWithSocialLinks.approvalStatus,
          profileImage: artistWithSocialLinks.profileImage,
          coverImage: artistWithSocialLinks.coverImage,
          minimumBid: artistWithSocialLinks.minimumBid,
          currency: artistWithSocialLinks.currency,
          socialLinks: artistWithSocialLinks.socialLinks,
        });
        
        setPricingMatrix({
          default: artistWithSocialLinks.minimumBid,
          eventTypes: {
            wedding: artistWithSocialLinks.minimumBid * 1.5,
            corporate: artistWithSocialLinks.minimumBid * 1.2,
          },
          countries: {
            ae: artistWithSocialLinks.minimumBid * 1.3,
            sa: artistWithSocialLinks.minimumBid * 1.0,
          },
          specific: {
            wedding: {
              ae: artistWithSocialLinks.minimumBid * 2.0
            }
          }
        });
        
        setTags([
          { id: "1", name: "Live Performance", nameAr: "أداء حي" },
          { id: "2", name: "Studio Recording", nameAr: "تسجيل استوديو" }
        ]);
        
        const sampleBlockedDates = [
          new Date(new Date().getFullYear(), new Date().getMonth(), 15),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
        ];
        setBlockedDates(sampleBlockedDates);
      } else {
        toast.error(t("Artist not found", "لم يتم العثور على الفنان"));
        navigate("/artists");
      }
    } else {
      navigate("/artists");
    }
    
    setLoading(false);
    document.title = id ? `Edit Artist | Artist Booking Platform` : `Add New Artist | Artist Booking Platform`;
  }, [id, navigate, t, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form values:", values);
    console.log("Pricing matrix:", pricingMatrix);
    console.log("Tags:", tags);
    console.log("Blocked dates:", blockedDates);
    
    toast.success(t("Artist information updated successfully", "تم تحديث معلومات الفنان بنجاح"));
  };

  if (loading) {
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
          <main className="p-4 md:p-6">
            <div className="glass-card p-6 md:p-8 text-center">
              <p className="text-muted-foreground">{t("Loading artist information...", "جاري تحميل معلومات الفنان...")}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!artist) {
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
          <main className="p-4 md:p-6">
            <div className="glass-card p-6 md:p-8 text-center">
              <p className="text-muted-foreground">{t("Artist not found", "لم يتم العثور على الفنان")}</p>
              <Button className="mt-4" onClick={() => navigate("/artists")}>
                {t("Back to Artists", "العودة إلى الفنانين")}
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <main className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/artists")}
                className="self-start"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("Back", "رجوع")}
              </Button>
              
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {t("Edit Artist", "تعديل الفنان")} - {language === "ar" ? artist.nameAr : artist.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t("Update artist information and settings", "تحديث معلومات وإعدادات الفنان")}
                </p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-6 md:gap-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={cn(
                      "grid w-full mb-6 md:mb-8",
                      isMobile ? "grid-cols-2 gap-2" : "grid-cols-5 max-w-2xl"
                    )}>
                      <TabsTrigger value="basic" className="text-xs md:text-sm">
                        {t("Basic Info", "معلومات أساسية")}
                      </TabsTrigger>
                      <TabsTrigger value="media" className="text-xs md:text-sm">
                        {t("Media", "الوسائط")}
                      </TabsTrigger>
                      <TabsTrigger value="pricing" className="text-xs md:text-sm">
                        {t("Pricing", "التسعير")}
                      </TabsTrigger>
                      <TabsTrigger value="availability" className="text-xs md:text-sm">
                        {t("Availability", "التوفر")}
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="text-xs md:text-sm">
                        {t("Settings", "الإعدادات")}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic">
                      <BasicInfoTab 
                        form={form}
                        tags={tags}
                        setTags={setTags}
                        formSchema={formSchema}
                      />
                    </TabsContent>
                    
                    <TabsContent value="media">
                      <MediaTab form={form} />
                    </TabsContent>
                    
                    <TabsContent value="pricing">
                      <PricingTab 
                        form={form} 
                        pricingMatrix={pricingMatrix}
                        setPricingMatrix={setPricingMatrix}
                      />
                    </TabsContent>
                    
                    <TabsContent value="availability">
                      <AvailabilityTab 
                        form={form}
                        blockedDates={blockedDates}
                        setBlockedDates={setBlockedDates}
                      />
                    </TabsContent>
                    
                    <TabsContent value="settings">
                      <SettingsTab form={form} />
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="sticky bottom-0 mt-6 md:mt-8 p-3 md:p-4 bg-background/80 backdrop-blur-sm border-t flex justify-end">
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Changes", "حفظ التغييرات")}
                  </Button>
                </div>
              </form>
            </Form>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default EditArtist;
