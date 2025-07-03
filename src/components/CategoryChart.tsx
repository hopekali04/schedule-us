"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Goal } from "@/types/types"

interface CategoryChartProps {
  goals: Goal[]
  categoryColors: Record<string, string>
}

export default function CategoryChart({ goals, categoryColors }: CategoryChartProps) {
  const categoryData = Object.entries(
    goals.reduce(
      (acc, goal) => {
        if (goal.categoryId) {
          acc[goal.categoryId] = (acc[goal.categoryId] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([category, count]) => ({
    name: category,
    value: count,
    color: categoryColors[category]?.replace("bg-", "#") || "#3B82F6",
  }))

  const COLORS = {
    Finance: "#10B981",
    Travel: "#F59E0B",
    Family: "#EC4899",
    Personal: "#6366F1",
    Professional: "#8B5CF6",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals by Category</CardTitle>
        <CardDescription>Distribution of your goals across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
