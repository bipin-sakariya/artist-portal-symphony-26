
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
import { ChevronLeft, Globe, Save, ChevronDown, ChevronUp, Image, Music, Calendar, PlusCircle, X, Tag } from "lucide-react";

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
  const [pricing, setPricing] = useState<PricingEntry[]>([]);
  const [tags, setTags] = useState<ArtistTags[]>([]);
  const [newTag, setNewTag] = useState({ name: "", nameAr: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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
        
        // Set form default values
        form.reset({
          name: foundArtist.name,
          nameAr: foundArtist.nameAr,
          genre: foundArtist.genre,
          genreAr: foundArtist.genreAr,
          location: foundArtist.location,
          locationAr: foundArtist.locationAr,
          bio: foundArtist.bio || "",
          bioAr: foundArtist.bioAr || "",
          isVerified: foundArtist.isVerified,
          isPromoted: foundArtist.isPromoted,
          isInternational: foundArtist.isInternational,
          approvalStatus: foundArtist.approvalStatus,
          profileImage: foundArtist.profileImage,
          coverImage: foundArtist.coverImage,
          minimumBid: foundArtist.minimumBid,
          currency: foundArtist.currency,
          socialLinks: foundArtist.socialLinks || {
            instagram: "",
            twitter: "",
            facebook: "",
            website: "",
          },
        });
        
        // Initialize sample pricing data
        // In a real app, this would come from the API
        setPricing([
          { eventType: "wedding", country: "sa", price: foundArtist.minimumBid * 1.5 },
          { eventType: "corporate", country: "sa", price: foundArtist.minimumBid * 1.2 },
          { eventType: "private", country: "ae", price: foundArtist.minimumBid * 2 },
        ]);
        
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
    console.log("Pricing data:", pricing);
    console.log("Tags:", tags);
    
    toast.success(t("Artist information updated successfully", "تم تحديث معلومات الفنان بنجاح"));
  };

  const addPricingEntry = () => {
    // Find first eventType and country that doesn't have a pricing entry
    const availableEventTypes = eventTypes.map(et => et.id);
    const availableCountries = countries.map(c => c.id);
    
    // Find combination that doesn't exist yet
    let newEventType = availableEventTypes[0];
    let newCountry = availableCountries[0];
    let found = false;
    
    for (const et of availableEventTypes) {
      for (const c of availableCountries) {
        if (!pricing.some(p => p.eventType === et && p.country === c)) {
          newEventType = et;
          newCountry = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    
    setPricing([...pricing, { 
      eventType: newEventType, 
      country: newCountry, 
      price: artist?.minimumBid || 0 
    }]);
  };

  const removePricingEntry = (index: number) => {
    setPricing(pricing.filter((_, i) => i !== index));
  };

  const updatePricingEntry = (index: number, field: keyof PricingEntry, value: string | number) => {
    const updatedPricing = [...pricing];
    updatedPricing[index] = { 
      ...updatedPricing[index], 
      [field]: field === 'price' ? Number(value) : value 
    };
    setPricing(updatedPricing);
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
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {t("Add Media", "إضافة وسائط")}
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
                          <CardTitle>{t("Basic Pricing", "التسعير الأساسي")}</CardTitle>
                          <CardDescription>
                            {t("Set the artist's base price and currency", "تعيين السعر الأساسي والعملة للفنان")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="minimumBid"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Minimum Bid", "الحد الأدنى للسعر")}</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      {...field}
                                      onChange={e => field.onChange(Number(e.target.value))} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t("The minimum amount that can be paid for this artist", "الحد الأدنى للمبلغ الذي يمكن دفعه لهذا الفنان")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="currency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("Currency", "العملة")}</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t("Select currency", "اختر العملة")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Advanced Pricing", "التسعير المتقدم")}</CardTitle>
                          <CardDescription>
                            {t("Set pricing for different event types and countries", "تعيين الأسعار لأنواع الفعاليات والبلدان المختلفة")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            {pricing.map((entry, index) => (
                              <div key={index} className="grid grid-cols-12 gap-4 items-center bg-muted/50 p-3 rounded-md">
                                <div className="col-span-4">
                                  <label className="text-xs text-muted-foreground mb-1 block">
                                    {t("Event Type", "نوع الفعالية")}
                                  </label>
                                  <Select
                                    value={entry.eventType}
                                    onValueChange={(value) => updatePricingEntry(index, 'eventType', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {eventTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                          {language === "ar" ? type.labelAr : type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="col-span-4">
                                  <label className="text-xs text-muted-foreground mb-1 block">
                                    {t("Country", "البلد")}
                                  </label>
                                  <Select
                                    value={entry.country}
                                    onValueChange={(value) => updatePricingEntry(index, 'country', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
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
                                
                                <div className="col-span-3">
                                  <label className="text-xs text-muted-foreground mb-1 block">
                                    {t("Price", "السعر")}
                                  </label>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      min="0"
                                      value={entry.price}
                                      onChange={(e) => updatePricingEntry(index, 'price', e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                      {form.watch('currency')}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="col-span-1 flex items-end justify-end h-full">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePricingEntry(index)}
                                    className="h-9 w-9 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={addPricingEntry}
                              className="mt-2 w-full"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              {t("Add Pricing Rule", "إضافة قاعدة تسعير")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("Artist Status", "حالة الفنان")}</CardTitle>
                          <CardDescription>
                            {t("Set the artist's approval status and visibility", "تعيين حالة موافقة الفنان والرؤية")}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <FormField
                            control={form.control}
                            name="approvalStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("Approval Status", "حالة الموافقة")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t("Select status", "اختر الحالة")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="approved">{t("Approved", "معتمد")}</SelectItem>
                                    <SelectItem value="pending">{t("Pending", "قيد الانتظار")}</SelectItem>
                                    <SelectItem value="rejected">{t("Rejected", "مرفوض")}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {t("Only approved artists are visible to customers", "فقط الفنانين المعتمدين مرئيين للعملاء")}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="isVerified"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>{t("Verified Artist", "فنان موثق")}</FormLabel>
                                    <FormDescription>
                                      {t("Mark this artist as verified with a badge", "وضع علامة لهذا الفنان كموثق بشارة")}
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
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>{t("Featured Artist", "فنان مميز")}</FormLabel>
                                    <FormDescription>
                                      {t("Promote this artist on the platform", "الترويج لهذا الفنان على المنصة")}
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
                              name="isInternational"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>{t("International Artist", "فنان دولي")}</FormLabel>
                                    <FormDescription>
                                      {t("This artist is available for international bookings", "هذا الفنان متاح للحجوزات الدولية")}
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
                          
                          <Collapsible className="mt-6 border rounded-md">
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                              <div className="flex items-center">
                                <span className="font-medium">{t("Danger Zone", "منطقة الخطر")}</span>
                              </div>
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                                <h4 className="text-sm font-medium text-destructive mb-2">
                                  {t("Delete Artist", "حذف الفنان")}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {t("Once deleted, this artist and all associated data will be permanently removed from the platform.", "بمجرد الحذف، سيتم إزالة هذا الفنان وجميع البيانات المرتبطة به بشكل دائم من المنصة.")}
                                </p>
                                <Button type="button" variant="destructive" size="sm">
                                  {t("Delete Artist", "حذف الفنان")}
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-4 mt-8">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/artists')}
                    >
                      {t("Cancel", "إلغاء")}
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
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
