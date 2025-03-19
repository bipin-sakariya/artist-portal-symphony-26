
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFilterProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  onFilter?: (filters: any) => void;
  filters?: {
    [key: string]: {
      label: string;
      labelAr: string;
      options: Array<{
        value: string;
        label: string;
        labelAr: string;
      }>;
    };
  };
}

const SearchFilter = ({ 
  placeholder, 
  onChange,
  onFilter,
  filters
}: SearchFilterProps) => {
  const { t, language } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>({});
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onChange?.(value);
  };
  
  const handleClearSearch = () => {
    setSearchValue("");
    onChange?.("");
  };
  
  const handleFilterChange = (category: string, value: string, isChecked: boolean) => {
    setActiveFilters(prev => {
      const currentFilters = {...prev};
      
      if (!currentFilters[category]) {
        currentFilters[category] = [];
      }
      
      if (isChecked) {
        currentFilters[category] = [...currentFilters[category], value];
      } else {
        currentFilters[category] = currentFilters[category].filter(v => v !== value);
      }
      
      // Remove empty categories
      if (currentFilters[category].length === 0) {
        delete currentFilters[category];
      }
      
      onFilter?.(currentFilters);
      return currentFilters;
    });
  };
  
  const handleRemoveFilter = (category: string, value: string) => {
    handleFilterChange(category, value, false);
  };
  
  const handleClearAllFilters = () => {
    setActiveFilters({});
    onFilter?.({});
  };
  
  const activeFilterCount = Object.values(activeFilters).flat().length;

  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          value={searchValue}
          onChange={handleSearch}
          placeholder={placeholder || t("Search...", "بحث...")}
          className="pl-9 pr-9 py-2 h-10 bg-background"
        />
        {searchValue && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            onClick={handleClearSearch}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        
        {filters && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2 relative" 
                aria-label="Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-3" 
              align="end"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t("Filters", "الفلاتر")}</h4>
                  {activeFilterCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={handleClearAllFilters}
                    >
                      {t("Clear All", "مسح الكل")}
                    </Button>
                  )}
                </div>
                
                {filters && Object.entries(filters).map(([key, filter]) => (
                  <div key={key} className="space-y-2">
                    <h5 className="text-sm font-medium">{language === 'ar' ? filter.labelAr : filter.label}</h5>
                    <div className="space-y-1.5">
                      {filter.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Checkbox 
                            id={`${key}-${option.value}`}
                            checked={activeFilters[key]?.includes(option.value)}
                            onCheckedChange={(checked) => 
                              handleFilterChange(key, option.value, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`${key}-${option.value}`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            {language === 'ar' ? option.labelAr : option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([category, values]) => 
            values.map(value => {
              const filterOption = filters?.[category]?.options.find(o => o.value === value);
              const label = language === 'ar' ? filterOption?.labelAr : filterOption?.label;
              
              return (
                <Badge 
                  key={`${category}-${value}`} 
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1 py-1 h-6"
                >
                  <span className="text-xs">
                    {label || value}
                  </span>
                  <button
                    className="ml-1 h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
                    onClick={() => handleRemoveFilter(category, value)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              );
            })
          )}
          
          {activeFilterCount > 0 && (
            <button 
              className="text-xs text-muted-foreground hover:text-foreground py-1"
              onClick={handleClearAllFilters}
            >
              {t("Clear All", "مسح الكل")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
