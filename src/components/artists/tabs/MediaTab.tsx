
import { useLanguage } from "@/hooks/use-language";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Music, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface MediaTabProps {
  form: UseFormReturn<any>;
}

const MediaTab = ({ form }: MediaTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
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
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Music Samples", "عينات موسيقية")}</CardTitle>
          <CardDescription>
            {t("Audio tracks and music samples", "مقاطع صوتية وعينات موسيقية")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Sample tracks */}
            {[
              { title: "Desert Nights", titleAr: "ليالي الصحراء", duration: "3:45" },
              { title: "Oriental Jazz", titleAr: "جاز شرقي", duration: "4:12" },
              { title: "Modern Oud", titleAr: "عود معاصر", duration: "2:58" }
            ].map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {track.title} / {track.titleAr}
                    </p>
                    <p className="text-xs text-muted-foreground">{track.duration}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            
            {/* Add new track */}
            <Button type="button" variant="outline" className="w-full">
              <Music className="h-4 w-4 mr-2" />
              {t("Add Music Sample", "إضافة عينة موسيقية")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaTab;
