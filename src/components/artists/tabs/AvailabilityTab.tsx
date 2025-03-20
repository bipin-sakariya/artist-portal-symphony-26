
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Calendar } from "@/components/ui/calendar";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CalendarX, CalendarCheck, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface AvailabilityTabProps {
  form: UseFormReturn<any>;
  blockedDates: Date[];
  setBlockedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const AvailabilityTab = ({ form, blockedDates, setBlockedDates }: AvailabilityTabProps) => {
  const { t, language } = useLanguage();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Disable dates that are already in the blockedDates array
  const disabledDays = blockedDates.map(date => new Date(date));

  // Function to block selected dates
  const blockDates = () => {
    if (selectedDates.length > 0) {
      setBlockedDates(prev => [...prev, ...selectedDates.map(date => new Date(date))]);
      setSelectedDates([]);
    }
  };

  // Function to clear all selected dates
  const clearSelectedDates = () => {
    setSelectedDates([]);
  };

  // Function to remove a blocked date
  const removeBlockedDate = (dateToRemove: Date) => {
    setBlockedDates(prev => 
      prev.filter(date => 
        date.getFullYear() !== dateToRemove.getFullYear() ||
        date.getMonth() !== dateToRemove.getMonth() ||
        date.getDate() !== dateToRemove.getDate()
      )
    );
  };

  // Function to remove all blocked dates
  const clearAllBlockedDates = () => {
    setBlockedDates([]);
  };

  // Group blocked dates by month for more compact display
  const groupedBlockedDates = blockedDates.reduce((acc, date) => {
    const monthYear = format(date, language === "ar" ? "MM/yyyy" : "MMMM yyyy");
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(date);
    return acc;
  }, {} as Record<string, Date[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-gotham-bold">{t("Artist Availability", "توفر الفنان")}</CardTitle>
          <CardDescription className="font-gotham-book">
            {t("Block dates when the artist is not available", "حظر التواريخ عندما لا يكون الفنان متاحًا")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-gotham-bold">
                  {t("Select dates to block", "حدد التواريخ للحظر")}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={blockDates} 
                    disabled={selectedDates.length === 0}
                    variant="outline"
                    size="sm"
                    className="gap-1 font-gotham-book"
                  >
                    <CalendarX className="h-4 w-4" />
                    {t("Block Selected", "حظر المحدد")}
                  </Button>
                  {selectedDates.length > 0 && (
                    <Button 
                      onClick={clearSelectedDates}
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive/90 hover:bg-destructive/10 font-gotham-book"
                    >
                      <X className="h-4 w-4" />
                      {t("Clear", "مسح")}
                    </Button>
                  )}
                </div>
              </div>
              <div className="border rounded-md p-1">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  disabled={disabledDays}
                  className="pointer-events-auto font-gotham-book"
                />
              </div>
              {selectedDates.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground mr-2 py-1 font-gotham-book">
                    {t("Selected dates:", "التواريخ المحددة:")}
                  </p>
                  {selectedDates.map((date, i) => (
                    <Badge key={i} variant="outline" className="gap-1 font-gotham-book">
                      {format(date, language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-gotham-bold">
                  {t("Blocked Dates", "التواريخ المحظورة")}
                </h3>
                {blockedDates.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllBlockedDates}
                    className="gap-1 text-destructive hover:text-destructive/90 hover:bg-destructive/10 font-gotham-book"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("Clear All", "مسح الكل")}
                  </Button>
                )}
              </div>
              
              {blockedDates.length === 0 ? (
                <div className="flex items-center justify-center h-64 border rounded-md p-6 bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <CalendarCheck className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-gotham-book">
                      {t("No blocked dates yet", "لا توجد تواريخ محظورة حتى الآن")}
                    </p>
                    <p className="text-sm mt-2 font-gotham-book">
                      {t("Select dates on the calendar to block them", "حدد تواريخًا في التقويم لحظرها")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4 h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {Object.entries(groupedBlockedDates).map(([monthYear, dates]) => (
                      <div key={monthYear} className="border-b pb-3 last:border-0 last:pb-0">
                        <h4 className="font-gotham-bold text-sm mb-2">{monthYear}</h4>
                        <div className="flex flex-wrap gap-2">
                          {dates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date, index) => (
                              <Badge 
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 pr-1 font-gotham-book"
                              >
                                {format(date, "d")}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-4 w-4 p-0 text-destructive rounded-full hover:bg-destructive/10"
                                  onClick={() => removeBlockedDate(date)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">{t("Remove", "إزالة")}</span>
                                </Button>
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityTab;
