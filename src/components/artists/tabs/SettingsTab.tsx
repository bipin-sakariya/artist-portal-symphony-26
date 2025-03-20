import { useLanguage } from "@/hooks/use-language";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Ban } from "lucide-react";
import { toast } from "sonner";

interface SettingsTabProps {
  form: UseFormReturn<any>;
}

const SettingsTab = ({ form }: SettingsTabProps) => {
  const { t } = useLanguage();
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  
  const approvalStatus = form.watch("approvalStatus");
  const isPending = approvalStatus === "pending";
  
  const handleReject = () => {
    form.setValue("approvalStatus", "rejected");
    setOpenRejectDialog(false);
    toast.success("Artist has been rejected");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Artist Settings", "إعدادات الفنان")}</CardTitle>
          <CardDescription>
            {t("Manage verification, approval, and other settings", "إدارة التحقق والموافقة والإعدادات الأخرى")}
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
                      {t("Mark this artist as verified with a badge", "تمييز هذا الفنان بعلامة التوثيق")}
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
                      {t("Promote Artist", "ترويج الفنان")}
                    </FormLabel>
                    <FormDescription>
                      {t("Show this artist in featured sections", "عرض هذا الفنان في الأقسام المميزة")}
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
            
            <FormField
              control={form.control}
              name="approvalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Approval Status", "حالة الموافقة")}</FormLabel>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
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
                    </div>
                    
                    {isPending && (
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenRejectDialog(true)}
                      >
                        <Ban className="mr-1 h-4 w-4" />
                        {t("Reject", "رفض")}
                      </Button>
                    )}
                  </div>
                  <FormDescription>
                    {t("Control whether this artist is visible on the platform", "التحكم في ما إذا كان هذا الفنان مرئيًا على المنصة")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Reject this artist?", "رفض هذا الفنان؟")}</DialogTitle>
            <DialogDescription>
              {t("This will change the artist's status to rejected. They will not be visible on the platform.", "سيؤدي ذلك إلى تغيير حالة الفنان إلى مرفوض. لن يكونوا مرئيين على المنصة.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpenRejectDialog(false)}>
              {t("Cancel", "إلغاء")}
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              {t("Reject Artist", "رفض الفنان")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{t("Danger Zone", "منطقة الخطر")}</CardTitle>
          <CardDescription>
            {t("Irreversible actions for this artist", "إجراءات لا رجعة فيها لهذا الفنان")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-destructive">
                  {t("Delete Artist", "حذف الفنان")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("Permanently delete this artist and all associated data", "حذف هذا الفنان وجميع البيانات المرتبطة به بشكل دائم")}
                </p>
              </div>
              <Button type="button" variant="destructive">
                {t("Delete Artist", "حذف الفنان")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
