
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/types/artist";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  bio: z.string(),
  bioAr: z.string(),
  genre: z.string(),
  genreAr: z.string(),
  location: z.string(),
  locationAr: z.string(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional(),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ArtistProfileTab = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for the artist profile
  const defaultValues: ProfileFormValues = {
    name: "John Legend",
    nameAr: "جون ليجند",
    bio: "Award-winning artist with over 10 years of experience performing at private and corporate events.",
    bioAr: "فنان حائز على جوائز مع أكثر من 10 سنوات من الخبرة في الأداء في الفعاليات الخاصة والشركات.",
    genre: "Pop",
    genreAr: "بوب",
    location: "Los Angeles, USA",
    locationAr: "لوس أنجلوس، الولايات المتحدة",
    socialLinks: {
      instagram: "johnlegend",
      twitter: "johnlegend",
      facebook: "johnlegendofficial",
      website: "johnlegend.com",
    },
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    // This would normally be an API call to update the profile
    setTimeout(() => {
      console.log("Profile update requested:", data);
      toast({
        title: t("Profile Update Requested", "تم طلب تحديث الملف الشخصي"),
        description: t(
          "Your profile update has been sent to admin for approval",
          "تم إرسال تحديث ملفك الشخصي إلى المسؤول للموافقة عليه"
        ),
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("My Profile", "ملفي الشخصي")}</CardTitle>
          <CardDescription>
            {t(
              "Update your profile information. Changes will be sent to admin for approval.",
              "قم بتحديث معلومات ملفك الشخصي. سيتم إرسال التغييرات إلى المسؤول للموافقة عليها."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/artists/artist1.jpg" alt="Artist" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                {t("Change Photo", "تغيير الصورة")}
              </Button>
              <Badge variant="outline" className="mt-2">
                {t("Verified Artist", "فنان موثق")}
              </Badge>
            </div>
            
            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Name (English)", "الاسم (بالإنجليزية)")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("Your name", "اسمك")} {...field} />
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
                            <Input placeholder={t("Your name in Arabic", "اسمك بالعربية")} {...field} />
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
                            placeholder={t("Your bio", "سيرتك الذاتية")} 
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
                            placeholder={t("Your bio in Arabic", "سيرتك الذاتية بالعربية")} 
                            className="min-h-32 text-right"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">{t("Social Media", "وسائل التواصل الاجتماعي")}</h3>
                    
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
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        t("Submitting...", "جارِ الإرسال...")
                      ) : (
                        t("Submit for Approval", "إرسال للموافقة")
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ArtistProfileTab;
