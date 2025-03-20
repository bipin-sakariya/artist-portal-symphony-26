
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
import { artists as mockArtists } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Save, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedArtist, ArtistTags, PricingMatrix } from "@/types/artist";
import BasicInfoTab from "@/components/artists/tabs/BasicInfoTab";
import MediaTab from "@/components/artists/tabs/MediaTab";
import PricingTab from "@/components/artists/tabs/PricingTab";
import SettingsTab from "@/components/artists/tabs/SettingsTab";

// Validation schema
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
  const [artist, setArtist] = useState<ExtendedArtist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<ArtistTags[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  
  // New pricing state
  const [pricingMatrix, setPricingMatrix] = useState<PricingMatrix>({
    default: 0,
    eventTypes: {},
    countries: {},
    specific: {}
  });

  // Initialize the form
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

  // Fetch artist data
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const foundArtist = mockArtists.find(a => a.id === id);
      
      if (foundArtist) {
        // Cast to ExtendedArtist
        const extendedArtist = foundArtist as ExtendedArtist;
        setArtist(extendedArtist);
        
        // Add socialLinks to the found artist if it doesn't exist
        const artistWithSocialLinks = {
          ...extendedArtist,
          socialLinks: extendedArtist.socialLinks || {
            instagram: "",
            twitter: "",
            facebook: "",
            website: "",
          }
        };
        
        // Set form default values
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
        
        // Initialize sample pricing matrix
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
        
        // Initialize sample tags
        setTags([
          { id: "1", name: "Live Performance", nameAr: "أداء حي" },
          { id: "2", name: "Studio Recording", nameAr: "تسجيل استوديو" }
        ]);
      } else {
        toast.error(t("Artist not found", "لم يتم العثور على الفنان"));
        navigate("/artists");
      }
    } else {
      // New artist case
      // In this mockup, we'll redirect to the artists page if no ID is provided
      navigate("/artists");
    }
    
    setLoading(false);
    // Set document title
    document.title = id ? `Edit Artist | Artist Booking Platform` : `Add New Artist | Artist Booking Platform`;
  }, [id, navigate, t, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would be an API call
    console.log("Form values:", values);
    console.log("Pricing matrix:", pricingMatrix);
    console.log("Tags:", tags);
    
    toast.success(t("Artist information updated successfully", "تم تحديث معلومات الفنان بنجاح"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
          <Header />
          <main className="p-6">
            <div className="glass-card p-8 text-center">
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
        <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
          <Header />
          <main className="p-6">
            <div className="glass-card p-8 text-center">
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
      
      <div className="flex-1 ml-72 max-w-[calc(100%-18rem)]">
        <Header />
        
        <PageTransition>
          <main className="p-6">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/artists")}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("Back", "رجوع")}
              </Button>
              
              <div>
                <h2 className="text-xl font-semibold">
                  {t("Edit Artist", "تعديل الفنان")} - {language === "ar" ? artist.nameAr : artist.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t("Update artist information and settings", "تحديث معلومات وإعدادات الفنان")}
                </p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
                      <TabsTrigger value="basic">
                        {t("Basic Info", "معلومات أساسية")}
                      </TabsTrigger>
                      <TabsTrigger value="media">
                        {t("Media", "الوسائط")}
                      </TabsTrigger>
                      <TabsTrigger value="pricing">
                        {t("Pricing", "التسعير")}
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        {t("Settings", "الإعدادات")}
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                      <BasicInfoTab 
                        form={form}
                        tags={tags}
                        setTags={setTags}
                        formSchema={formSchema}
                      />
                    </TabsContent>
                    
                    {/* Media Tab */}
                    <TabsContent value="media">
                      <MediaTab form={form} />
                    </TabsContent>
                    
                    {/* Pricing Tab */}
                    <TabsContent value="pricing">
                      <PricingTab 
                        form={form} 
                        pricingMatrix={pricingMatrix}
                        setPricingMatrix={setPricingMatrix}
                      />
                    </TabsContent>
                    
                    {/* Settings Tab */}
                    <TabsContent value="settings">
                      <SettingsTab form={form} />
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="sticky bottom-0 mt-8 p-4 bg-background/80 backdrop-blur-sm border-t flex justify-end">
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
