"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Goal } from "@/types/types"

interface GoalChartProps {
  goals: Goal[]
}

export default function GoalChart({ goals }: GoalChartProps) {
  // Generate mock progress data for the last 6 months
  const generateProgressData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      progress: Math.min(100, (index + 1) * 15 + Math.random() * 10),
      goals: Math.floor(Math.random() * 3) + goals.length - 2,
    }))
  }

  const data = generateProgressData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your goal completion progress over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `${value}${name === "progress" ? "%" : ""}`,
                name === "progress" ? "Avg Progress" : "Active Goals",
              ]}
            />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="goals"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
