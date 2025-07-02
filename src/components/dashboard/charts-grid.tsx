// components/dashboard/charts-grid.tsx
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { GoalWithProgress } from "@/types/types";

interface ChartsGridProps {
    goals: GoalWithProgress[];
}

// Re-usable chart card component
const ChartCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
        <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div style={{ width: '100%', height: 300 }}>
                {children}
            </div>
        </CardContent>
    </Card>
);

export default function ChartsGrid({ goals }: ChartsGridProps) {
    const categoryData = useMemo(() => {
        const categoryMap = new Map<string, number>();
        goals.forEach(goal => {
            const category = goal.name; // Using name as category for now
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });
        const total = goals.length || 1;
        return Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value: (value / total) * 100,
        }));
    }, [goals]);

    const progressData = useMemo(() => {
        // This is still mock data, but could be replaced with real aggregated data from the API
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map((month, index) => ({
          month,
          progress: Math.min(100, (index + 1) * 15 + Math.random() * 10),
          goals: Math.floor(Math.random() * 3) + 2,
        }));
    }, []);

    const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Progress Overview" description="Your goal completion progress over the last 6 months">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '0.5rem' }} />
                        <Line type="monotone" dataKey="progress" name="Avg Progress" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="goals" name="New Goals" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Goals by Category" description="Distribution of your goals across different categories">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
                        <Legend iconType="circle" />
                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}