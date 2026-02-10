"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

type DashboardChartsProps = {
  usersPerDay: Array<{ date: string; users: number }>;
  usersPerMonth: Array<{ month: string; users: number }>;
  commentsPerDay: Array<{ date: string; comments: number }>;
  commentsPerMonth: Array<{ month: string; comments: number }>;
};

export function DashboardCharts({
  usersPerDay,
  usersPerMonth,
  commentsPerDay,
  commentsPerMonth,
}: DashboardChartsProps) {
  return (
    <div className="space-y-10">
      {/* User Growth */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="text-black" header="New Users – Last 30 Days">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="text-black" header="New Users – Last 12 Months">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Comment Growth */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="text-black" header="Comments – Last 30 Days">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="text-black" header="Comments – Last 12 Months">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commentsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comments" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
