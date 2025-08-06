"use client";

import React from "react";

// Re-export components from recharts
export {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Scatter,
  ScatterChart,
} from "recharts";

// Export a ChartTooltip component for custom tooltips
export const ChartTooltip = ({ active, payload, label, ...props }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-foreground">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Export a ChartContainer component for consistent styling
export const ChartContainer = ({ children, className, ...props }) => {
  return (
    <div className={`w-full overflow-x-auto ${className || ""}`} {...props}>
      {children}
    </div>
  );
};