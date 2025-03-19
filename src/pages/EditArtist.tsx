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
import { Artist, artists as mockArtists } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Globe, Save, ChevronDown, ChevronUp, Image, Music, Calendar, PlusCircle, X, Tag, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define event types
const eventTypes = [
  { id: "wedding", label: "Wedding", labelAr: "زفاف" },
  { id: "corporate", label: "Corporate", labelAr: "شركات" },
  { id: "concert", label: "Concert", labelAr: "حفل" },
  { id: "festival", label: "Festival", labelAr: "مهرجان" },
  { id: "private", label: "Private Party", labelAr: "حفلة خاصة" }
];

// Define countries
const countries = [
  { id: "sa", label: "Saudi Arabia", labelAr: "المملكة العربية السعودية" },
  { id: "ae", label: "UAE", labelAr: "الإمارات العربية المتحدة" },
  { id: "kw", label: "Kuwait", labelAr: "الكويت" },
  { id: "bh", label: "Bahrain", labelAr: "البحرين" },
  { id: "qa", label: "Qatar", labelAr: "قطر" },
  { id: "om", label: "Oman", labelAr: "عمان" },
  { id: "eg", label: "Egypt", labelAr: "مصر" },
  { id: "lb", label: "Lebanon", labelAr: "لبنان" },
  { id: "jo", label: "Jordan", labelAr: "الأردن" }
];

// Define genres
const genres = [
  { id: "jazz_fusion", label: "Jazz Fusion", labelAr: "جاز فيوجن" },
  { id: "arabic_pop", label: "Arabic Pop", labelAr: "بوب عربي" },
  { id: "oud_master", label: "Oud Master", labelAr: "أستاذ العود" },
  { id: "electronic", label: "Electronic", labelAr: "إلكترونية" },
  { id: "folk_band", label: "Folk Band", labelAr: "فرقة فولك" },
  { id: "classical", label: "Classical", labelAr: "كلاسيكية" },
  { id: "hiphop", label: "Hip Hop", labelAr: "هيب هوب" }
];

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

// Type for pricing
interface PricingEntry {
  eventType: string;
  country: string;
  price: number;
}

// New interface for the more intuitive pricing model
interface PricingMatrix {
  default: number;
  eventTypes: Record<string, number>;
  countries: Record<string, number>;
  specific: Record<string, Record<string, number>>;
}

interface ArtistTags {
  id: string;
  name: string;
  nameAr: string;
}

const EditArtist = () => {
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<ArtistTags[]>([]);
  const [newTag, setNewTag] = useState({ name: "", nameAr: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // New pricing state
  const [pricingMatrix, setPricingMatrix] = useState<PricingMatrix>({
    default: 0,
    eventTypes: {},
    countries: {},
    specific: {}
  });
  
  // State for new price entry
  const [newPriceType, setNewPriceType] = useState<"eventType" | "country" | "specific">("eventType");
  const [newEventType, setNewEventType] = useState<string>("");
  const [newCountry, setNewCountry] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number>(0);

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
        setArtist(foundArtist);
        
        // Add socialLinks to the found artist if it doesn't exist
        const artistWithSocialLinks = {
          ...foundArtist,
          socialLinks: foundArtist.socialLinks || {
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

  // Function to get the effective price for a combination of event type and country
  const getEffectivePrice = (eventType: string, country: string): number => {
    // Check if there's a specific price for this combination
    if (pricingMatrix.specific[eventType]?.[country]) {
      return pricingMatrix.specific[eventType][country];
    }
    
    // Check if there's a price for this event type
    if (pricingMatrix.eventTypes[eventType]) {
      return pricingMatrix.eventTypes[eventType];
    }
    
    // Check if there's a price for this country
    if (pricingMatrix.countries[country]) {
      return pricingMatrix.countries[country];
    }
    
    // Fall back to default price
    return pricingMatrix.default;
  };

  // Add a new price rule
  const addPriceRule = () => {
    if (newPriceType === "eventType" && newEventType) {
      setPricingMatrix({
        ...pricingMatrix,
        eventTypes: {
          ...pricingMatrix.eventTypes,
          [newEventType]: newPrice
        }
      });
    } else if (newPriceType === "country" && newCountry) {
      setPricingMatrix({
        ...pricingMatrix,
        countries: {
          ...pricingMatrix.countries,
          [newCountry]: newPrice
        }
      });
    } else if (newPriceType === "specific" && newEventType && newCountry) {
      const updatedSpecific = { ...pricingMatrix.specific };
      if (!updatedSpecific[newEventType]) {
        updatedSpecific[newEventType] = {};
      }
      updatedSpecific[newEventType][newCountry] = newPrice;
      
      setPricingMatrix({
        ...pricingMatrix,
        specific: updatedSpecific
      });
    }
    
    // Reset form
    setNewPrice(0);
    setNewEventType("");
    setNewCountry("");
  };

  // Remove a price rule
  const removePriceRule = (type: "eventType" | "country" | "specific", eventType?: string, country?: string) => {
    if (type === "eventType" && eventType) {
      const { [eventType]: removed, ...restEventTypes } = pricingMatrix.eventTypes;
      setPricingMatrix({
        ...pricingMatrix,
        eventTypes: restEventTypes
      });
    } else if (type === "country" && country) {
      const { [country]: removed, ...restCountries } = pricingMatrix.countries;
      setPricingMatrix({
        ...pricingMatrix,
        countries: restCountries
      });
    } else if (type === "specific" && eventType && country) {
      const updatedSpecific = { ...pricingMatrix.specific };
      if (updatedSpecific[eventType]) {
        const { [country]: removed, ...restCountries } = updatedSpecific[eventType];
        
        if (Object.keys(restCountries).length === 0) {
          // If no countries left, remove the event type entry
          const { [eventType]: removed, ...restEventTypes } = updatedSpecific;
          setPricingMatrix({
            ...pricingMatrix,
            specific: restEventTypes
          });
        } else {
          // Otherwise update the countries for this event type
          updatedSpecific[eventType] = restCountries;
          setPricingMatrix({
            ...pricingMatrix,
            specific: updatedSpecific
          });
        }
      }
    }
  };

  const addTag = () => {
    if (newTag.name && newTag.nameAr) {
      setTags([...tags, { 
        id: Date.now().toString(), 
        name: newTag.name, 
        nameAr: newTag.nameAr 
      }]);
      setNewTag({ name: "", nameAr: "" });
    }
  };

  const removeTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
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
                    <TabsContent value="basic" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Basic Information", "المعلومات الأساسية")}</CardTitle>
                          <CardDescription>
                            {t("Artist's primary details and descriptions", "التفاصيل والأوصاف الأساسية للفنان")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Name (English)", "الاسم (بالإنجليزية)")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("Artist name", "اسم الفنان")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="nameAr"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Name (Arabic)", "الاسم (بالعربية)")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("Artist name in Arabic", "اسم الفنان بالعربية")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="genre"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Genre (English)", "النوع (بالإنجليزية)")}</FormLabel>
                                  <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("Select genre", "اختر النوع")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {genres.map((genre) => (
                                        <SelectItem key={genre.id} value={genre.label}>
                                          {genre.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="genreAr"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Genre (Arabic)", "النوع (بالعربية)")}</FormLabel>
                                  <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("Select genre", "اختر النوع")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {genres.map((genre) => (
                                        <SelectItem key={genre.id} value={genre.labelAr}>
                                          {genre.labelAr}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Location (English)", "الموقع (بالإنجليزية)")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("City, Country", "المدينة، البلد")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="locationAr"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Location (Arabic)", "الموقع (بالعربية)")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t("City, Country in Arabic", "المدينة، البلد بالعربية")} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Biography (English)", "السيرة الذاتية (بالإنجليزية)")}</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={t("Describe the artist", "وصف الفنان")} 
                                    className="min-h-32"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bioAr"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Biography (Arabic)", "السيرة الذاتية (بالعربية)")}</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={t("Describe the artist in Arabic", "وصف الفنان بالعربية")} 
                                    className="min-h-32 text-right"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-4">
                            <h3 className="font-medium text-sm">{t("Artist Tags", "علامات الفنان")}</h3>
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge key={tag.id} variant="secondary" className="px-2 py-1 text-xs flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {language === "ar" ? tag.nameAr : tag.name}
                                  <button 
                                    type="button"
                                    onClick={() => removeTag(tag.id)} 
                                    className="ml-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Input
                                  placeholder={t("Tag name (English)", "اسم العلامة (بالإنجليزية)")}
                                  value={newTag.name}
                                  onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder={t("Tag name (Arabic)", "اسم العلامة (بالعربية)")}
                                  value={newTag.nameAr}
                                  onChange={(e) => setNewTag({...newTag, nameAr: e.target.value})}
                                />
                              </div>
                              <div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={addTag}
                                  disabled={!newTag.name || !newTag.nameAr}
                                >
                                  <PlusCircle className="h-4 w-4 mr-1" />
                                  {t("Add Tag", "إضافة علامة")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Social Media", "وسائل التواصل الاجتماعي")}</CardTitle>
                          <CardDescription>
                            {t("Artist's social media accounts and website", "حسابات الفنان على وسائل التواصل الاجتماعي والموقع الإلكتروني")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="socialLinks.instagram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instagram</FormLabel>
                                  <FormControl>
                                    <Input placeholder="instagram.com/username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="socialLinks.twitter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Twitter / X</FormLabel>
                                  <FormControl>
                                    <Input placeholder="twitter.com/username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="socialLinks.facebook"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facebook</FormLabel>
                                  <FormControl>
                                    <Input placeholder="facebook.com/pagename" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="socialLinks.website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Website", "الموقع الإلكتروني")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Media Tab */}
                    <TabsContent value="media" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Profile Media", "وسائط الملف الشخصي")}</CardTitle>
                          <CardDescription>
                            {t("Artist's profile and cover images", "صور الملف الشخصي والغلاف للفنان")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="profileImage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("Profile Image", "صورة الملف الشخصي")}</FormLabel>
                                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center">
                                      {field.value ? (
                                        <div className="relative">
                                          <img 
                                            src={field.value} 
                                            alt={t("Profile", "الملف الشخصي")} 
                                            className="mx-auto h-32 w-32 rounded-full object-cover"
                                          />
                                          <div className="mt-2">
                                            <Button 
                                              type="button" 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => form.setValue('profileImage', '')}
                                            >
                                              {t("Remove", "إزالة")}
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center py-4">
                                          <Image className="h-10 w-10 text-muted-foreground" />
                                          <p className="mt-2 text-sm text-muted-foreground">
                                            {t("Upload a profile image", "قم بتحميل صورة الملف الشخصي")}
                                          </p>
                                          <Button type="button" variant="secondary" size="sm" className="mt-2">
                                            {t("Upload", "تحميل")}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    <FormControl>
                                      <Input 
                                        placeholder={t("Image URL", "رابط الصورة")} 
                                        {...field} 
                                        className="mt-2"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="coverImage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("Cover Image", "صورة الغلاف")}</FormLabel>
                                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center">
                                      {field.value ? (
                                        <div className="relative">
                                          <img 
                                            src={field.value} 
                                            alt={t("Cover", "الغلاف")} 
                                            className="mx-auto h-32 w-full rounded-md object-cover"
                                          />
                                          <div className="mt-2">
                                            <Button 
                                              type="button" 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => form.setValue('coverImage', '')}
                                            >
                                              {t("Remove", "إزالة")}
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center py-4">
                                          <Image className="h-10 w-10 text-muted-foreground" />
                                          <p className="mt-2 text-sm text-muted-foreground">
                                            {t("Upload a cover image", "قم بتحميل صورة الغلاف")}
                                          </p>
                                          <Button type="button" variant="secondary" size="sm" className="mt-2">
                                            {t("Upload", "تحميل")}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    <FormControl>
                                      <Input 
                                        placeholder={t("Image URL", "رابط الصورة")} 
                                        {...field} 
                                        className="mt-2"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">
                              {t("Media Gallery", "معرض الوسائط")}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {/* Empty gallery placeholders */}
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div 
                                  key={i}
                                  className="rounded-lg border-2 border-dashed border-muted-foreground/25 aspect-square flex flex-col items-center justify-center"
                                >
                                  <Image className="h-8 w-8 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {t("Add media", "إضافة وسائط")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Pricing Configuration", "تكوين التسعير")}</CardTitle>
                          <CardDescription>
                            {t("Set default price and rules for different event types and countries", "تعيين السعر الافتراضي والقواعد لأنواع الأحداث والبلدان المختلفة")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-medium mb-2">
                                {t("Default Price", "السعر الافتراضي")}
                              </h3>
                              <div className="flex items-end gap-4">
                                <div className="flex-1 max-w-xs">
                                  <FormField
                                    control={form.control}
                                    name="minimumBid"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t("Minimum Bid", "الحد الأدنى للعرض")}</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(Number(e.target.value));
                                              setPricingMatrix({
                                                ...pricingMatrix,
                                                default: Number(e.target.value)
                                              });
                                            }}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          {t("Base price for all events", "السعر الأساسي لجميع الفعاليات")}
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <div className="w-32">
                                  <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t("Currency", "العملة")}</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder={t("Select currency", "اختر العملة")} />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="SAR">SAR (﷼)</SelectItem>
                                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium">
                                {t("Price Rules", "قواعد التسعير")}
                              </h3>
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex flex-wrap gap-4 mb-4">
                                  <div className="flex-1 min-w-[180px]">
                                    <label className="text-xs font-medium mb-1 block">
                                      {t("Rule Type", "نوع القاعدة")}
                                    </label>
                                    <Select 
                                      value={newPriceType} 
                                      onValueChange={(value) => setNewPriceType(value as any)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="eventType">
                                          {t("Event Type", "نوع الحدث")}
                                        </SelectItem>
                                        <SelectItem value="country">
                                          {t("Country", "الدولة")}
                                        </SelectItem>
                                        <SelectItem value="specific">
                                          {t("Specific Combination", "مجموعة محددة")}
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  {(newPriceType === "eventType" || newPriceType === "specific") && (
                                    <div className="flex-1 min-w-[180px]">
                                      <label className="text-xs font-medium mb-1 block">
                                        {t("Event Type", "نوع الحدث")}
                                      </label>
                                      <Select 
                                        value={newEventType} 
                                        onValueChange={setNewEventType}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder={t("Select event type", "اختر نوع الحدث")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {eventTypes.map((event) => (
                                            <SelectItem key={event.id} value={event.id}>
                                              {language === "ar" ? event.labelAr : event.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                  
                                  {(newPriceType === "country" || newPriceType === "specific") && (
                                    <div className="flex-1 min-w-[180px]">
                                      <label className="text-xs font-medium mb-1 block">
                                        {t("Country", "الدولة")}
                                      </label>
                                      <Select 
                                        value={newCountry} 
                                        onValueChange={setNewCountry}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder={t("Select country", "اختر الدولة")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.id}>
                                              {language === "ar" ? country.labelAr : country.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-[180px]">
                                    <label className="text-xs font-medium mb-1 block">
                                      {t("Price", "السعر")}
                                    </label>
                                    <div className="flex gap-2">
                                      <Input 
                                        type="number" 
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(Number(e.target.value))}
                                      />
                                      <Button
                                        type="button"
                                        onClick={addPriceRule}
                                        disabled={
                                          (newPriceType === "eventType" && !newEventType) ||
                                          (newPriceType === "country" && !newCountry) ||
                                          (newPriceType === "specific" && (!newEventType || !newCountry))
                                        }
                                      >
                                        {t("Add", "إضافة")}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-lg overflow-hidden border">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>{t("Rule Type", "نوع القاعدة")}</TableHead>
                                      <TableHead>{t("Details", "التفاصيل")}</TableHead>
                                      <TableHead>{t("Price", "السعر")}</TableHead>
                                      <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        <Badge variant="outline">{t("Default", "افتراضي")}</Badge>
                                      </TableCell>
                                      <TableCell>{t("All events, all countries", "جميع الأحداث، جميع البلدان")}</TableCell>
                                      <TableCell>{pricingMatrix.default} {form.watch("currency")}</TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                    
                                    {/* Event Type Rules */}
                                    {Object.entries(pricingMatrix.eventTypes).map(([eventId, price]) => {
                                      const event = eventTypes.find(e => e.id === eventId);
                                      return (
                                        <TableRow key={`event-${eventId}`}>
                                          <TableCell>
                                            <Badge variant="outline" className="bg-primary/10">
                                              {t("Event Type", "نوع الحدث")}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {event ? (language === "ar" ? event.labelAr : event.label) : eventId}
                                          </TableCell>
                                          <TableCell>{price} {form.watch("currency")}</TableCell>
                                          <TableCell>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removePriceRule("eventType", eventId)}
                                            >
                                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                    
                                    {/* Country Rules */}
                                    {Object.entries(pricingMatrix.countries).map(([countryId, price]) => {
                                      const country = countries.find(c => c.id === countryId);
                                      return (
                                        <TableRow key={`country-${countryId}`}>
                                          <TableCell>
                                            <Badge variant="outline" className="bg-secondary/10">
                                              {t("Country", "الدولة")}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {country ? (language === "ar" ? country.labelAr : country.label) : countryId}
                                          </TableCell>
                                          <TableCell>{price} {form.watch("currency")}</TableCell>
                                          <TableCell>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removePriceRule("country", undefined, countryId)}
                                            >
                                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                    
                                    {/* Specific Combinations */}
                                    {Object.entries(pricingMatrix.specific).flatMap(([eventId, countries]) => {
                                      const event = eventTypes.find(e => e.id === eventId);
                                      return Object.entries(countries).map(([countryId, price]) => {
                                        const country = countries.find(c => c.id === countryId);
                                        return (
                                          <TableRow key={`specific-${eventId}-${countryId}`}>
                                            <TableCell>
                                              <Badge variant="outline" className="bg-destructive/10">
                                                {t("Specific", "محدد")}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              {event ? (language === "ar" ? event.labelAr : event.label) : eventId}
                                              {" + "}
                                              {country ? (language === "ar" ? country.labelAr : country.label) : countryId}
                                            </TableCell>
                                            <TableCell>{price} {form.watch("currency")}</TableCell>
                                            <TableCell>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removePriceRule("specific", eventId, countryId)}
                                              >
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      });
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                              
                              <div className="bg-muted/30 p-4 rounded-lg mt-4">
                                <h4 className="text-sm font-medium mb-2">
                                  {t("Price Matrix Preview", "معاينة مصفوفة الأسعار")}
                                </h4>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead></TableHead>
                                        {countries.slice(0, 5).map((country) => (
                                          <TableHead key={country.id}>
                                            {language === "ar" ? country.labelAr : country.label}
                                          </TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {eventTypes.slice(0, 5).map((event) => (
                                        <TableRow key={event.id}>
                                          <TableCell className="font-medium">
                                            {language === "ar" ? event.labelAr : event.label}
                                          </TableCell>
                                          {countries.slice(0, 5).map((country) => (
                                            <TableCell key={country.id}>
                                              {getEffectivePrice(event.id, country.id)} {form.watch("currency")}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Artist Settings", "إعدادات الفنان")}</CardTitle>
                          <CardDescription>
                            {t("Configure visibility, approval, and other settings", "تكوين الظهور والموافقة والإعدادات الأخرى")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="isVerified"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      {t("Verified Artist", "فنان موثق")}
                                    </FormLabel>
                                    <FormDescription>
                                      {t("Artist's identity and credentials have been verified", "تم التحقق من هوية الفنان وأوراق اعتماده")}
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="isPromoted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      {t("Featured Artist", "فنان مميز")}
                                    </FormLabel>
                                    <FormDescription>
                                      {t("Promote this artist on homepage and search results", "عرض هذا الفنان في الصفحة الرئيسية ونتائج البحث")}
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="isInternational"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      {t("International Artist", "فنان دولي")}
                                    </FormLabel>
                                    <FormDescription>
                                      {t("Artist is available for international bookings", "الفنان متاح للحجوزات الدولية")}
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="approvalStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Approval Status", "حالة الموافقة")}</FormLabel>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("Select status", "اختر الحالة")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="approved">
                                        {t("Approved", "تمت الموافقة")}
                                      </SelectItem>
                                      <SelectItem value="pending">
                                        {t("Pending", "قيد الانتظار")}
                                      </SelectItem>
                                      <SelectItem value="rejected">
                                        {t("Rejected", "مرفوض")}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    {t("Current approval status of this artist", "حالة الموافقة الحالية لهذا الفنان")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">{t("Danger Zone", "منطقة الخطر")}</h3>
                            <div className="rounded-lg border border-destructive/30 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-destructive">{t("Deactivate Artist", "إلغاء تنشيط الفنان")}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {t("Temporarily hide this artist from the platform", "إخفاء هذا الفنان مؤقتًا من المنصة")}
                                  </p>
                                </div>
                                <Button type="button" variant="destructive" className="ml-4">
                                  {t("Deactivate", "إلغاء التنشيط")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end py-4">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t("Save Changes", "حفظ التغييرات")}
                    </Button>
                  </div>
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
