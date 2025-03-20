import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  X, 
  CalendarX, 
  CalendarCheck, 
  Trash2, 
  CalendarRange, 
  Calendar as CalendarIcon, 
  ShieldAlert,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { format, addDays, isWithinInterval, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/dashboard/PageTransition";

const ArtistCalendarTab = () => {
  const { t, language } = useLanguage();
  const [blockedDates, setBlockedDates] = useState<Date[]>([
    new Date(2023, 11, 5),
    new Date(2023, 11, 6),
    new Date(2023, 11, 15),
    new Date(2023, 11, 20),
    new Date(2024, 0, 10),
  ]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  const toggleRangeMode = () => {
    setIsRangeMode(!isRangeMode);
    setSelectedDates([]);
    setRangeStart(null);
    setIsSelectingRange(false);
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!isRangeMode || !dates) {
      setSelectedDates(dates || []);
      return;
    }

    if (!isSelectingRange) {
      if (dates.length > 0) {
        const lastSelected = dates[dates.length - 1];
        setRangeStart(lastSelected);
        setSelectedDates([lastSelected]);
        setIsSelectingRange(true);
      }
    } else {
      if (dates.length > 0 && rangeStart) {
        const rangeEnd = dates[dates.length - 1];
        
        const range: Date[] = [];
        let currentDate = new Date(rangeStart);
        
        const startDate = rangeStart < rangeEnd ? rangeStart : rangeEnd;
        const endDate = rangeStart < rangeEnd ? rangeEnd : rangeStart;
        
        while (currentDate <= endDate) {
          range.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setSelectedDates(range);
        setIsSelectingRange(false);
        setRangeStart(null);
      }
    }
  };

  const handleSingleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (isSelectingRange && rangeStart) {
      const range: Date[] = [];
      
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
      setRangeStart(date);
      setSelectedDates([date]);
      setIsSelectingRange(true);
    }
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => 
      blockedDate.getFullYear() === date.getFullYear() &&
      blockedDate.getMonth() === date.getMonth() &&
      blockedDate.getDate() === date.getDate()
    );
  };

  const blockDates = () => {
    if (selectedDates.length > 0) {
      const newBlockedDates = selectedDates.filter(date => !isDateBlocked(date));
      
      if (newBlockedDates.length === 0) {
        toast({
          title: t("No Changes Made", "لم يتم إجراء أي تغييرات"),
          description: t(
            "These dates are already blocked",
            "هذه التواريخ محظورة بالفعل"
          ),
        });
        return;
      }
      
      setBlockedDates(prev => [...prev, ...newBlockedDates]);
      setSelectedDates([]);
      setRangeStart(null);
      setIsSelectingRange(false);
      
      toast({
        title: t("Dates Blocked", "تم حظر التواريخ"),
        description: t(
          `${newBlockedDates.length} date(s) have been marked as unavailable`,
          `تم تحديد ${newBlockedDates.length} تاريخ (تواريخ) كغير متاح`
        ),
      });
    }
  };

  const clearSelectedDates = () => {
    setSelectedDates([]);
    setRangeStart(null);
    setIsSelectingRange(false);
  };

  const removeBlockedDate = (dateToRemove: Date) => {
    setBlockedDates(prev => 
      prev.filter(date => 
        date.getFullYear() !== dateToRemove.getFullYear() ||
        date.getMonth() !== dateToRemove.getMonth() ||
        date.getDate() !== dateToRemove.getDate()
      )
    );
    
    toast({
      title: t("Date Unblocked", "تم إلغاء حظر التاريخ"),
      description: t(
        "The selected date has been removed from your blocked dates",
        "تم إزالة التاريخ المحدد من تواريخك المحظورة"
      ),
    });
  };

  const clearAllBlockedDates = () => {
    setBlockedDates([]);
    
    toast({
      title: t("All Dates Unblocked", "تم إلغاء حظر جميع التواريخ"),
      description: t(
        "All blocked dates have been cleared",
        "تم مسح جميع التواريخ المحظورة"
      ),
    });
  };

  const groupedBlockedDates = blockedDates.reduce((acc, date) => {
    const monthYear = format(date, language === "ar" ? "MM/yyyy" : "MMMM yyyy");
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(date);
    return acc;
  }, {} as Record<string, Date[]>);

  const commonCalendarProps = {
    disabled: (date: Date) => {
      return blockedDates.some(disabledDate => 
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
      );
    },
    modifiers: {
      rangeStart: rangeStart ? [rangeStart] : [],
      isSelectingRange: isSelectingRange,
      blocked: blockedDates
    },
    modifiersStyles: {
      rangeStart: {
        color: "white",
        backgroundColor: "var(--primary)",
        borderRadius: "50%"
      }
    },
    className: "pointer-events-auto font-gotham-book",
    numberOfMonths: window.innerWidth > 768 ? 2 : 1,
    classNames: {
      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-md transition-all duration-200",
      day_today: "bg-orange-100 text-orange-800 font-bold rounded-md transition-all duration-200",
      day_disabled: "text-muted-foreground opacity-50 bg-red-50 line-through rounded-md transition-all duration-200",
      day_range_middle: "bg-orange-50 text-orange-900 rounded-none transition-all duration-200",
      day_hidden: "invisible transition-all duration-200",
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-gotham-bold flex items-center gap-2 text-primary">
              <CalendarRange className="h-5 w-5" />
              {t("Manage Availability", "إدارة التوفر")}
            </CardTitle>
            <CardDescription className="font-gotham-book">
              {t("Block dates when you are not available for bookings", "حظر التواريخ عندما لا تكون متاحًا للحجوزات")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant={isRangeMode ? "secondary" : "outline"} 
                  size="sm" 
                  className="gap-1 font-gotham-book transition-all duration-200"
                  onClick={toggleRangeMode}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {t("Single Select", "اختيار فردي")}
                </Button>
                <Button 
                  variant={isRangeMode ? "outline" : "secondary"} 
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
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-md text-sm font-gotham-book flex items-center gap-1"
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
                  className="border rounded-md p-1 bg-card dark:bg-black/90 shadow-subtle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isRangeMode && isSelectingRange ? (
                    <Calendar 
                      mode="single"
                      selected={rangeStart}
                      onSelect={handleSingleDateSelect}
                      {...commonCalendarProps}
                    />
                  ) : isRangeMode ? (
                    <Calendar 
                      mode="single"
                      selected={selectedDates[0]}
                      onSelect={handleSingleDateSelect}
                      {...commonCalendarProps}
                    />
                  ) : (
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
                                <Badge variant="outline" className="gap-1 font-gotham-book bg-white">
                                  {format(date, language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                                </Badge>
                              </motion.div>
                            ))
                          ) : (
                            <>
                              <Badge variant="outline" className="gap-1 font-gotham-book bg-white">
                                {format(selectedDates[0], language === "ar" ? "dd/MM/yyyy" : "MMM d, yyyy")}
                              </Badge>
                              <Badge variant="outline" className="gap-1 font-gotham-book bg-white flex items-center">
                                <ArrowRight className="h-3 w-3 mx-1" />
                              </Badge>
                              <Badge variant="outline" className="gap-1 font-gotham-book bg-white">
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
                    className="flex items-center justify-center h-64 border rounded-md p-6 bg-muted/30"
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
                    className="border rounded-md p-4 h-[500px] overflow-y-auto bg-white shadow-subtle"
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
    </PageTransition>
  );
};

export default ArtistCalendarTab;
