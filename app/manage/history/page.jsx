"use client";

import * as React from "react";

import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import colors from "@/components/colors";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const chartConfig = {
  expired: {
    label: "Expired Items",
    color: colors.expired.color
  },
  saved: {
    label: "Saved Items",
    color: colors.saved.color
  },
};

export default function FoodWasteChart() {
  const [history, setHistory] = React.useState(null);
  const [dailyHistory, setDailyHistory] = React.useState(null);
  const [monthlyHistory, setMonthlyHistory] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/manage/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);

        const monthlyData = data.reduce((acc, item) => {
          const month = item.date.split("-")[1];
          if (acc[month]) {
            acc[month].expired += item.expired;
            acc[month].saved += item.saved;
          } else {
            acc[month] = { expired: item.expired, saved: item.saved };
          }
          return acc;
        }, {});

        setMonthlyHistory(Object.keys(monthlyData).map((month) => ({ month: monthNames[+month - 1], ...monthlyData[month] })));

        const dailyData = data.reduce((acc, item) => {
          const dateParts = item.date.split("-");
          const date = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
          if (acc[date]) {
            acc[date].expired += item.expired;
            acc[date].saved += item.saved;
          } else {
            acc[date] = { expired: item.expired, saved: item.saved };
          }
          return acc;
        }, {});

        setDailyHistory(Object.keys(dailyData).map((date) => ({ date, ...dailyData[date] })));
      });
  }, []);
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Food Waste Tracking
        </h2>
        <p className="text-muted-foreground">
          Comparison of expired vs saved food items
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Daily Comparison
        </h3>
        <p className="text-muted-foreground">
          Comparison of expired vs saved food items on a daily basis
        </p>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[400px]">
        {
          !dailyHistory &&
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        }
        {
          dailyHistory &&
          <BarChart
            accessibilityLayer
            data={dailyHistory}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: 'Number of Items', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent indicator="bar" />} 
            />
            <Bar
              dataKey="expired"
              fill={"#eb4034"}
              radius={4}
            />
            <Bar
              dataKey="saved"
              fill={"#32a852"}
              radius={4}
            />
          </BarChart>
        }
      </ChartContainer>

      <div className="mb-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Monthly Comparison
        </h3>
        <p className="text-muted-foreground">
          Comparison of expired vs saved food items on a monthly basis
        </p>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[400px]">
        {
          !monthlyHistory &&
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        }
        {
          monthlyHistory &&
          <BarChart
            accessibilityLayer
            data={monthlyHistory}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: 'Number of Items', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent indicator="bar" />} 
            />
            <Bar
              dataKey="expired"
              fill={"#eb4034"}
              radius={4}
            />
            <Bar
              dataKey="saved"
              fill={"#32a852"}
              radius={4}
            />
          </BarChart>
        }
      </ChartContainer>
    </div>
  );
}

/*const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/manage/history")
      .then((res) => res.json())
      .then((data) => {
        const monthlyData = data.reduce((acc, item) => {
          const month = item.date.split("-")[1];
          if (acc[month]) {
            acc[month].expired += item.expired;
            acc[month].saved += item.saved;
          } else {
            acc[month] = { expired: item.expired, saved: item.saved };
          }
          return acc;
        }, {});

        setHistory(monthlyData);
      });
  }, []); */
