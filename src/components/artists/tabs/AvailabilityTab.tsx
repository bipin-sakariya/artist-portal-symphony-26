
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Calendar } from "@/components/ui/calendar";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CalendarX, CalendarCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";

interface AvailabilityTabProps {
  form: UseFormReturn<any>;
  blockedDates: Date[];
  setBlockedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const AvailabilityTab = ({ form, blockedDates, setBlockedDates }: AvailabilityTabProps) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Disable dates that are already in the blockedDates array
  const disabledDays = blockedDates.map(date => new Date(date));

  // Function to block a date
  const blockDate = () => {
    if (selectedDate) {
      setBlockedDates(prev => [...prev, new Date(selectedDate)]);
      setSelectedDate(undefined);
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Artist Availability", "توفر الفنان")}</CardTitle>
          <CardDescription>
            {t("Block dates when the artist is not available", "حظر التواريخ عندما لا يكون الفنان متاحًا")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-medium mb-4">
                {t("Select dates to block", "حدد التواريخ للحظر")}
              </h3>
              <div className="border rounded-md p-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  className="pointer-events-auto"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={blockDate} 
                  disabled={!selectedDate}
                  variant="outline"
                  className="gap-2"
                >
                  <CalendarX className="h-4 w-4" />
                  {t("Block Selected Date", "حظر التاريخ المحدد")}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4">
                {t("Currently Blocked Dates", "التواريخ المحظورة حاليًا")}
              </h3>
              {blockedDates.length === 0 ? (
                <div className="flex items-center justify-center h-64 border rounded-md p-6 bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <CalendarCheck className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>
                      {t("No blocked dates yet", "لا توجد تواريخ محظورة حتى الآن")}
                    </p>
                    <p className="text-sm mt-2">
                      {t("Select a date on the calendar to block it", "حدد تاريخًا في التقويم لحظره")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4 max-h-[500px] overflow-y-auto">
                  <ul className="space-y-2">
                    {blockedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <li 
                          key={index} 
                          className="flex items-center justify-between p-2 border-b last:border-0"
                        >
                          <span className="font-medium">
                            {format(date, language === "ar" ? "dd/MM/yyyy" : "MMMM dd, yyyy")}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeBlockedDate(date)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t("Remove", "إزالة")}</span>
                          </Button>
                        </li>
                      ))}
                  </ul>
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
