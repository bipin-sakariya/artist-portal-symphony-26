
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface TopArtistsChartProps {
  data: {
    name: string;
    bookings: number;
    revenue: number;
  }[];
}

const TopArtistsChart = ({ data }: TopArtistsChartProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Top Performing Artists", "أفضل الفنانين أداءً")}</CardTitle>
        <CardDescription>
          {t("Artists with the highest bookings and revenue", "الفنانون ذوو الحجوزات والإيرادات الأعلى")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tick={{ 
                    fill: 'hsl(var(--muted-foreground))',
                    textAnchor: 'end',
                    dy: 20,
                    transform: 'rotate(-45)' 
                  }}
                />
                <YAxis 
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  content={<ChartTooltip />}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 20
                  }}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="bookings" 
                  name={t("Bookings", "الحجوزات")}
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="revenue" 
                  name={t("Revenue (USD)", "الإيرادات (دولار أمريكي)")}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopArtistsChart;
