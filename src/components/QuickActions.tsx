"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, TrendingUp, Calendar, Zap } from "lucide-react"

interface QuickActionsProps {
  onCreateGoal: () => void
  onJoinGroup: () => void
}

export default function QuickActions({ onCreateGoal, onJoinGroup }: QuickActionsProps) {
  const quickActions = [
    {
      title: "Create Goal",
      description: "Set a new personal or group goal",
      icon: Target,
      color: "bg-blue-500",
      action: onCreateGoal,
    },
    {
      title: "Join Group",
      description: "Connect with friends and family",
      icon: Users,
      color: "bg-purple-500",
      action: onJoinGroup,
    },
    {
      title: "Quick Update",
      description: "Log progress on existing goals",
      icon: TrendingUp,
      color: "bg-green-500",
      action: () => {},
    },
    {
      title: "Set Reminder",
      description: "Never miss a milestone",
      icon: Calendar,
      color: "bg-orange-500",
      action: () => {},
    },
  ]

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>Get things done faster with these shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
              onClick={action.action}
            >
              <div className={`${action.color} p-2 rounded-lg`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-gray-600">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
