import React from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const ChartShell = ({ title, children, height = 240 }) => (
  <div className="w-full" role="img" aria-label={title}>
    <p className="text-sm font-medium mb-2">{title}</p>
    <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>
  </div>
);

export const RevenueChart = ({ data = [] }) => (
  <ChartShell title="Revenue"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#29625d" /></LineChart></ChartShell>
);
export const ROIChart = ({ data = [] }) => (
  <ChartShell title="ROI"><BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#fed592" /></BarChart></ChartShell>
);
export const UsageChart = ({ data = [] }) => <RevenueChart data={data} />;
export const CreditsChart = ({ data = [] }) => <ROIChart data={data} />;
export const OrdersChart = ({ data = [] }) => <RevenueChart data={data} />;
export const AnalyticsChart = ({ data = [] }) => <ROIChart data={data} />;
export const TrendChart = RevenueChart;
export const ConversionChart = ({ data = [] }) => (
  <ChartShell title="Conversion"><LineChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#1a4c47" /></LineChart></ChartShell>
);
export const ProviderUsageChart = ({ data = [] }) => (
  <ChartShell title="Provider Usage"><BarChart data={data}><XAxis dataKey="provider" /><YAxis /><Tooltip /><Bar dataKey="requests" fill="#29625d" /></BarChart></ChartShell>
);

export default { RevenueChart, ROIChart, UsageChart, CreditsChart, OrdersChart, AnalyticsChart, TrendChart, ConversionChart, ProviderUsageChart };
