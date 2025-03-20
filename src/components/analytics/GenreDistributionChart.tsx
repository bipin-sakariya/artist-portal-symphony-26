
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface GenreDistributionChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const GenreDistributionChart = ({ data }: GenreDistributionChartProps) => {
  const { t } = useLanguage();
  
  // Colors for pie chart
  const GENRE_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Most Requested Genres", "الأنواع الأكثر طلبًا")}</CardTitle>
        <CardDescription>
          {t("Distribution of booking requests by genre", "توزيع طلبات الحجز حسب النوع")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer config={{
            genre: {
              label: t("Genre Distribution", "توزيع الأنواع")
            }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenreDistributionChart;
