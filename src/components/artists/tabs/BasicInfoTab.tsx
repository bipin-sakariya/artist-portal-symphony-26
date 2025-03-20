
import { useLanguage } from "@/hooks/use-language";
import { genres } from "@/types/artist";
import { ArtistTags } from "@/types/artist";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  tags: ArtistTags[];
  setTags: React.Dispatch<React.SetStateAction<ArtistTags[]>>;
  formSchema: z.ZodObject<any>;
}

const BasicInfoTab = ({ form, tags, setTags, formSchema }: BasicInfoTabProps) => {
  const { t, language } = useLanguage();
  const [newTag, setNewTag] = useState({ name: "", nameAr: "" });

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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default BasicInfoTab;
