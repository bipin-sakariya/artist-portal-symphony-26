import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [newPriceType, setNewPriceType] = useState<"eventType" | "country" | "specific">("eventType");
  const [newEventType, setNewEventType] = useState<string>("");
  const [newCountry, setNewCountry] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number>(0);

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Pricing Structure", "هيكل التسعير")}</CardTitle>
          <CardDescription>
            {t("Set base prices and price rules for different event types and countries", "تعيين الأسعار الأساسية وقواعد الأسعار لأنواع الفعاليات والبلدان المختلفة")}
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
                    {t("This is the default price when no specific rules apply", "هذا هو السعر الافتراضي عندما لا تنطبق قواعد محددة")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("Price Rules", "قواعد التسعير")}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-2">{t("Add New Price Rule", "إضافة قاعدة سعر جديدة")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Select 
                      value={newPriceType} 
                      onValueChange={(value: "eventType" | "country" | "specific") => setNewPriceType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Rule Type", "نوع القاعدة")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eventType">{t("Event Type", "نوع الفعالية")}</SelectItem>
                        <SelectItem value="country">{t("Country", "البلد")}</SelectItem>
                        <SelectItem value="specific">{t("Specific Combination", "مجموعة محددة")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(newPriceType === "eventType" || newPriceType === "specific") && (
                    <div>
                      <Select 
                        value={newEventType} 
                        onValueChange={setNewEventType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Event Type", "نوع الفعالية")} />
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
                  )}
                  
                  {(newPriceType === "country" || newPriceType === "specific") && (
                    <div>
                      <Select 
                        value={newCountry} 
                        onValueChange={setNewCountry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Country", "البلد")} />
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
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={t("Price", "السعر")}
                      value={newPrice || ""}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addPriceRule}
                      disabled={
                        (newPriceType === "eventType" && !newEventType) ||
                        (newPriceType === "country" && !newCountry) ||
                        (newPriceType === "specific" && (!newEventType || !newCountry)) ||
                        newPrice <= 0
                      }
                    >
                      {t("Add", "إضافة")}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleCategory("eventTypes")}
                >
                  <h4 className="text-sm font-medium">{t("Event Type Prices", "أسعار أنواع الفعاليات")}</h4>
                  {expandedCategories.eventTypes ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                
                {expandedCategories.eventTypes && (
                  <div className="p-4 border-t">
                    {Object.keys(pricingMatrix.eventTypes).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(pricingMatrix.eventTypes).map(([eventTypeId, price]) => {
                          const eventType = eventTypes.find(et => et.id === eventTypeId);
                          return (
                            <div key={eventTypeId} className="flex items-center justify-between">
                              <span>{language === "ar" ? eventType?.labelAr : eventType?.label}</span>
                              <div className="flex items-center gap-2">
                                <span>{price} {form.watch("currency")}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removePriceRule("eventType", eventTypeId)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t("No event type specific prices set yet", "لم يتم تعيين أسعار محددة لنوع الفعالية بعد")}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="rounded-md border">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleCategory("countries")}
                >
                  <h4 className="text-sm font-medium">{t("Country Prices", "أسعار البلدان")}</h4>
                  {expandedCategories.countries ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                
                {expandedCategories.countries && (
                  <div className="p-4 border-t">
                    {Object.keys(pricingMatrix.countries).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(pricingMatrix.countries).map(([countryId, price]) => {
                          const country = countries.find(c => c.id === countryId);
                          return (
                            <div key={countryId} className="flex items-center justify-between">
                              <span>{language === "ar" ? country?.labelAr : country?.label}</span>
                              <div className="flex items-center gap-2">
                                <span>{price} {form.watch("currency")}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removePriceRule("country", undefined, countryId)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t("No country specific prices set yet", "لم يتم تعيين أسعار محددة للبلدان بعد")}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="rounded-md border">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleCategory("specific")}
                >
                  <h4 className="text-sm font-medium">{t("Specific Combinations", "مجموعات محددة")}</h4>
                  {expandedCategories.specific ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                
                {expandedCategories.specific && (
                  <div className="p-4 border-t">
                    {Object.keys(pricingMatrix.specific).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(pricingMatrix.specific).map(([eventTypeId, countriesObj]) => {
                          const eventType = eventTypes.find(et => et.id === eventTypeId);
                          return Object.entries(countriesObj).map(([countryId, price]) => {
                            const country = countries.find(c => c.id === countryId);
                            return (
                              <div key={`${eventTypeId}-${countryId}`} className="flex items-center justify-between">
                                <span>
                                  {language === "ar" ? eventType?.labelAr : eventType?.label} - {language === "ar" ? country?.labelAr : country?.label}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span>{price} {form.watch("currency")}</span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removePriceRule("specific", eventTypeId, countryId)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t("No specific combination prices set yet", "لم يتم تعيين أسعار لمجموعات محددة بعد")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">{t("Price Matrix Preview", "معاينة مصفوفة الأسعار")}</h3>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">{t("Event Type / Country", "نوع الفعالية / البلد")}</TableHead>
                      {countries.slice(0, 5).map((country) => (
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
                        {countries.slice(0, 5).map((country) => (
                          <TableCell key={country.id}>
                            {getEffectivePrice(eventType.id, country.id)} {form.watch("currency")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTab;
