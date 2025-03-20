
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PricingMatrix, eventTypes, countries } from "@/types/artist";

interface PricingTabProps {
  form: UseFormReturn<any>;
  pricingMatrix: PricingMatrix;
  setPricingMatrix: React.Dispatch<React.SetStateAction<PricingMatrix>>;
}

const PricingTab = ({ form, pricingMatrix, setPricingMatrix }: PricingTabProps) => {
  const { t, language } = useLanguage();

  // Handle price changes in the matrix
  const handlePriceChange = (eventTypeId: string, countryId: string, value: string) => {
    const numValue = Number(value) || 0;
    
    // Create a deep copy of the pricing matrix
    const newMatrix = { ...pricingMatrix };
    
    // Ensure the event type exists in specific
    if (!newMatrix.specific[eventTypeId]) {
      newMatrix.specific[eventTypeId] = {};
    }
    
    // Update the specific price
    newMatrix.specific[eventTypeId][countryId] = numValue;
    
    // Update the state
    setPricingMatrix(newMatrix);
  };

  // Get the effective price for a combination (for display or editing)
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Pricing Structure", "هيكل التسعير")}</CardTitle>
          <CardDescription>
            {t("Set prices for different event types and countries", "تعيين الأسعار لأنواع الفعاليات والبلدان المختلفة")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="minimumBid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Default Price", "السعر الافتراضي")}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          setPricingMatrix(prev => ({
                            ...prev,
                            default: value
                          }));
                        }}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="SAR" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAR">SAR</SelectItem>
                            <SelectItem value="AED">AED</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <FormDescription>
                    {t("This is the default price when no specific prices are set", "هذا هو السعر الافتراضي عندما لا تكون هناك أسعار محددة")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4">{t("Price Matrix", "مصفوفة الأسعار")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("Enter prices for each event type and country combination. Leave empty to use the default price.", 
                "أدخل الأسعار لكل مجموعة من نوع الفعالية والبلد. اترك فارغًا لاستخدام السعر الافتراضي.")}
            </p>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">{t("Event Type / Country", "نوع الفعالية / البلد")}</TableHead>
                    {countries.map((country) => (
                      <TableHead key={country.id}>
                        {language === "ar" ? country.labelAr : country.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventTypes.map((eventType) => (
                    <TableRow key={eventType.id}>
                      <TableCell className="font-medium">
                        {language === "ar" ? eventType.labelAr : eventType.label}
                      </TableCell>
                      {countries.map((country) => (
                        <TableCell key={country.id} className="p-2">
                          <Input
                            type="number"
                            value={getEffectivePrice(eventType.id, country.id) || ""}
                            placeholder={pricingMatrix.default.toString()}
                            onChange={(e) => handlePriceChange(eventType.id, country.id, e.target.value)}
                            className="h-8 text-center"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 italic">
              {t("Tip: Empty fields will use the default price", "نصيحة: الحقول الفارغة ستستخدم السعر الافتراضي")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTab;
