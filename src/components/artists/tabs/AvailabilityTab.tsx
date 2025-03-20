
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Calendar } from "@/components/ui/calendar";
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CalendarX, CalendarCheck, Trash2, CalendarRange, Calendar as CalendarIcon, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface AvailabilityTabProps {
  form: UseFormReturn<any>;
  blockedDates: Date[];
  setBlockedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const AvailabilityTab = ({ form, blockedDates, setBlockedDates }: AvailabilityTabProps) => {
  const { t, language } = useLanguage();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  // Function to toggle between single and range selection modes
  const toggleRangeMode = () => {
    setIsRangeMode(!isRangeMode);
    setSelectedDates([]);
    setRangeStart(null);
    setIsSelectingRange(false);
  };

  // Handle date selection based on the mode (single or range)
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!isRangeMode || !dates) {
      setSelectedDates(dates || []);
      return;
    }
  };

  // Handle single date selection in range mode
  const handleSingleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // If already selecting a range
    if (isSelectingRange && rangeStart) {
      // Create array of dates in the range
      const range: Date[] = [];
      
      // Ensure the range is always from earlier to later date, regardless of selection order
      const startDate = rangeStart < date ? rangeStart : date;
      const endDate = rangeStart < date ? date : rangeStart;
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        range.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setSelectedDates(range);
      setIsSelectingRange(false);
      setRangeStart(null);
    } else {
      // First click in range selection
      setRangeStart(date);
      setSelectedDates([date]);
      setIsSelectingRange(true);
    }
  };

  // Custom modifiers for the calendar
  const modifiers = {
    rangeStart: rangeStart ? [rangeStart] : [],
    isSelectingRange: isSelectingRange,
    blocked: blockedDates
  };

  // Custom modifier styles
  const modifiersStyles = {
    rangeStart: {
      color: "white",
      backgroundColor: "var(--primary)",
      borderRadius: "50%"
    }
  };

  // Function to check if a date is already blocked
  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => 
      blockedDate.getFullYear() === date.getFullYear() &&
      blockedDate.getMonth() === date.getMonth() &&
      blockedDate.getDate() === date.getDate()
    );
  };

  // Function to block selected dates
  const blockDates = () => {
    if (selectedDates.length > 0) {
      // Filter out dates that are already blocked
      const newBlockedDates = selectedDates.filter(date => !isDateBlocked(date));
      
      if (newBlockedDates.length === 0) {
        // If all selected dates are already blocked, just clear the selection
        setSelectedDates([]);
        setRangeStart(null);
        setIsSelectingRange(false);
        return;
      }
      
      setBlockedDates(prev => [...prev, ...newBlockedDates]);
      setSelectedDates([]);
      setRangeStart(null);
      setIsSelectingRange(false);
    }
  };

  // Function to clear all selected dates
  const clearSelectedDates = () => {
    setSelectedDates([]);
    setRangeStart(null);
    setIsSelectingRange(false);
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

  // Common calendar props
  const commonCalendarProps = {
    disabled: (date: Date) => {
      // Disable dates that are already in the blockedDates array
      return blockedDates.some(disabledDate => 
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
      );
    },
    modifiers: modifiers,
    modifiersStyles: modifiersStyles,
    className: "pointer-events-auto font-gotham-book",
    classNames: {
      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-md transition-all duration-200",
      day_today: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 font-bold rounded-md transition-all duration-200",
      day_disabled: "text-muted-foreground opacity-50 bg-red-50 dark:bg-red-950/30 dark:text-gray-400 line-through rounded-md transition-all duration-200",
      day_range_middle: "bg-orange-50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100 rounded-none transition-all duration-200",
      day_hidden: "invisible transition-all duration-200",
    }
  };

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
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant={isRangeMode ? "default" : "secondary"} 
                size="sm" 
                className="gap-1 font-gotham-book transition-all duration-200"
                onClick={toggleRangeMode}
              >
                <CalendarIcon className="h-4 w-4" />
                {t("Single Select", "اختيار فردي")}
              </Button>
              <Button 
                variant={isRangeMode ? "secondary" : "default"} 
                size="sm" 
                className="gap-1 font-gotham-book transition-all duration-200"
                onClick={toggleRangeMode}
              >
                <CalendarRange className="h-4 w-4" />
                {t("Range Select", "اختيار النطاق")}
              </Button>
            </div>
            
            {isSelectingRange && rangeStart && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-100 px-3 py-1 rounded-md text-sm font-gotham-book flex items-center gap-1"
              >
                <ShieldAlert className="h-4 w-4" />
                {t("Select end date", "حدد تاريخ الانتهاء")}
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-gotham-bold flex items-center gap-2">
                  {isRangeMode ? (
                    <>
                      <CalendarRange className="h-4 w-4 text-primary" />
                      {t("Select date range to block", "حدد نطاق التاريخ للحظر")}
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      {t("Select dates to block", "حدد التواريخ للحظر")}
                    </>
                  )}
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
              
              <motion.div 
                className="border rounded-md p-1 bg-white dark:bg-background shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isRangeMode ? (
                  // Range mode
                  <Calendar 
                    mode="single"
                    selected={rangeStart}
                    onSelect={handleSingleDateSelect}
                    {...commonCalendarProps}
                  />
                ) : (
                  // Multiple selection mode
                  <Calendar 
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={handleDateSelect}
                    {...commonCalendarProps}
                  />
                )}
              </motion.div>
              
              <AnimatePresence>
                {selectedDates.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground font-gotham-book">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        {t("Selected dates:", "التواريخ المحددة:")} 
                        <span className="font-semibold text-foreground">{selectedDates.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDates.length <= 10 ? (
                          selectedDates.map((date, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Badge variant="outline" className="gap-1 font-gotham-book bg-white dark:bg-background/40 dark:text-white">
                                {format(date, language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                              </Badge>
                            </motion.div>
                          ))
                        ) : (
                          <>
                            <Badge variant="outline" className="gap-1 font-gotham-book bg-white dark:bg-background/40 dark:text-white">
                              {format(selectedDates[0], language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                            </Badge>
                            <Badge variant="outline" className="gap-1 font-gotham-book bg-white dark:bg-background/40 dark:text-white flex items-center">
                              <ArrowRight className="h-3 w-3 mx-1" />
                            </Badge>
                            <Badge variant="outline" className="gap-1 font-gotham-book bg-white dark:bg-background/40 dark:text-white">
                              {format(selectedDates[selectedDates.length - 1], language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                            </Badge>
                            <Badge variant="secondary" className="gap-1 font-gotham-bold">
                              {selectedDates.length} {t("days", "أيام")}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-gotham-bold flex items-center gap-2">
                  <CalendarX className="h-4 w-4 text-primary" />
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
                <motion.div 
                  className="flex items-center justify-center h-64 border rounded-md p-6 bg-muted/30 dark:bg-muted/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center text-muted-foreground">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <CalendarCheck className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    </motion.div>
                    <p className="font-gotham-book">
                      {t("No blocked dates yet", "لا توجد تواريخ محظورة حتى الآن")}
                    </p>
                    <p className="text-sm mt-2 font-gotham-book">
                      {t("Select dates on the calendar to block them", "حدد تواريخًا في التقويم لحظرها")}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="border rounded-md p-4 h-[500px] overflow-y-auto bg-white dark:bg-background shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatePresence>
                    <div className="space-y-4">
                      {Object.entries(groupedBlockedDates).map(([monthYear, dates], groupIndex) => (
                        <motion.div 
                          key={monthYear} 
                          className="border-b pb-3 last:border-0 last:pb-0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: groupIndex * 0.1 }}
                        >
                          <h4 className="font-gotham-bold text-sm mb-2 flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            {monthYear}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {dates
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: (groupIndex * 0.1) + (index * 0.02) }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  layout
                                >
                                  <Badge 
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
                                </motion.div>
                              ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityTab;
