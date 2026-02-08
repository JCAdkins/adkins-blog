"use client"; // ← This is required!

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// Add other recharts sub-components you need (e.g. Tooltip, Legend, etc.)

type DashboardChartsProps = {
  blogGrowthData: Array<{ name: string; blogs: number }>; // adjust shape to your data
  // add other props for other charts
};

export function DashboardCharts({ blogGrowthData }: DashboardChartsProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Blog Growth</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={blogGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="blogs" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Add more charts here, e.g. BarChart for comments per blog */}
    </div>
  );
}
