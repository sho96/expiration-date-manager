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

        setHistory(Object.keys(monthlyData).map((month) => ({ month: monthNames[+month - 1], ...monthlyData[month] })));
      });
  }, []);
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Food Waste Tracking
        </h2>
        <p className="text-muted-foreground">
          Monthly comparison of expired vs saved food items
        </p>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[400px]">
        {
          !history &&
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        }
        {
          history &&
          <BarChart
            accessibilityLayer
            data={history}
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
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${colors.expired.bgColor} border ${colors.expired.borderColor} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 ${colors.expired.bgColor} brightness-200 rounded-full`}></div>
            <h3 className={`font-semibold ${colors.expired.color}`}>Expired Items</h3>
          </div>
          <p className={`${colors.expired.color} text-sm`}>
          </p>
        </div>

        {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="font-semibold text-green-800">Saved Items</h3>
          </div>
          <p className="text-green-700 text-sm">
            Consistently increasing - excellent food preservation efforts!
          </p>
        </div> */}
        <div className={`${colors.saved.bgColor} border ${colors.saved.borderColor} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 ${colors.saved.bgColor} brightness-200 rounded-full`}></div>
            <h3 className={`font-semibold ${colors.saved.color}`}>Saved Items</h3>
          </div>
          <p className={`${colors.saved.color} text-sm`}>
          </p>
        </div>
      </div>
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
