
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const RevenueSourceChart = () => {
  const { t } = useLanguage();

  const data = [
    { name: t("Corporate", "شركات"), value: 45 },
    { name: t("Private", "خاص"), value: 30 },
    { name: t("Festivals", "مهرجانات"), value: 15 },
    { name: t("Ticketed", "تذاكر"), value: 10 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("Revenue Sources", "مصادر الإيرادات")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#3498db" />
                <Cell fill="#e74c3c" />
                <Cell fill="#2ecc71" />
                <Cell fill="#f39c12" />
              </Pie>
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value}%`, t("Percentage", "النسبة المئوية")]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#3498db]" />
            <span className="text-xs text-muted-foreground">{t("Corporate", "شركات")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#e74c3c]" />
            <span className="text-xs text-muted-foreground">{t("Private", "خاص")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#2ecc71]" />
            <span className="text-xs text-muted-foreground">{t("Festivals", "مهرجانات")}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#f39c12]" />
            <span className="text-xs text-muted-foreground">{t("Ticketed", "تذاكر")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSourceChart;
