"use client";

import * as React from "react";

import { CartesianGrid, Bar, BarChart, XAxis, YAxis, ResponsiveContainer, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import colors from "@/components/colors";
import { Card, CardContent } from "@/components/ui/card";
import { ChartColumn } from "lucide-react";

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
    color: "#a800b7"
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

        setMonthlyHistory(Object.keys(monthlyData).map((month) => ({ month: monthNames[+month - 1], ...monthlyData[month] })).sort((a, b) => +a.month - +b.month));

        const dailyData = data.reduce((acc, item) => {
          // skip if older than 30 days
          if (new Date(item.date) < new Date(new Date().setDate(new Date().getDate() - 30))) return acc;
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

        setDailyHistory(Object.keys(dailyData).map((date) => ({ date, ...dailyData[date] })).sort((a, b) => new Date(a.date) - new Date(b.date)));
      });
  }, []);
  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          <ChartColumn size={30} className="mr-3"/>
          
          History
        </h1>
        <p className="text-muted-foreground">
          History of expired vs saved food items
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          30 day history
        </h3>
        <p className="text-muted-foreground">
          30 day history of expired vs saved food items
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card className={`${colors.saved.bgColor} border-l-4 ${colors.saved.color.replace("text-", "border-")}`}>
            <CardContent className="flex flex-col gap-2 items-center justify-center">
              <h3 className="text-lg font-semibold text-foreground"># Saved</h3>
              {/* <p className="text-muted-foreground">{dailyHistory?.reduce((acc, item) => acc + item.saved, 0)}</p> */}
              <h3 className="text-lg font-semibold text-foreground">{dailyHistory?.reduce((acc, item) => acc + item.saved, 0)}</h3>
            </CardContent>
          </Card>
          <Card className={`${colors.expired.bgColor} border-l-4 ${colors.expired.color.replace("text-", "border-")}`}>
            <CardContent className="flex flex-col gap-2 items-center justify-center">
              <h3 className="text-lg font-semibold text-foreground"># Expired</h3>
              {/* <p className="text-muted-foreground">{dailyHistory?.reduce((acc, item) => acc + item.expired, 0)}</p> */}
              <h3 className="text-lg font-semibold text-foreground">{dailyHistory?.reduce((acc, item) => acc + item.expired, 0)}</h3>
            </CardContent>
          </Card>
        </div>
      </div>
      <ResponsiveContainer width="100%" config={chartConfig} aspect={4 / 3}>
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
            className="w-full h-full"
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
              label={{ value: '# items', angle: -90, position: 'left' }}
            />
            {/* <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent indicator="bar" />} 
            /> */}
            <Bar
              dataKey="expired"
              fill={"#a800b7"}
              radius={4}
            />
            <Bar
              dataKey="saved"
              fill={"#32a852"}
              radius={4}
            />
          </BarChart>
        }
      </ResponsiveContainer>

      <div className="mb-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Monthly History
        </h3>
        <p className="text-muted-foreground">
          Monthly history of expired vs saved food items
        </p>
      </div>
      <ResponsiveContainer width="100%" config={chartConfig} aspect={4 / 3}>
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
              label={{ value: '# items', angle: -90, position: 'left' }}
            />
            {/* <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent indicator="bar" />} 
            /> */}
            <Bar
              dataKey="expired"
              fill={"#a800b7"}
              radius={4}
            />
            <Bar
              dataKey="saved"
              fill={"#32a852"}
              radius={4}
            />
          </BarChart>
        }
      </ResponsiveContainer>
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
