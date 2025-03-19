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

// Define extended Artist interface with social links
interface ExtendedArtist extends Artist {
  socialLinks?: {
    instagram: string;
    twitter: string;
    facebook: string;
    website: string;
  };
}

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
  const [artist, setArtist] = useState<ExtendedArtist | null>(null);
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
