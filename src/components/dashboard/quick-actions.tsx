// components/dashboard/quick-actions.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Target, TrendingUp, Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onCreateGoal: () => void;
  onJoinGroup: () => void;
}

export default function QuickActions({ onCreateGoal, onJoinGroup }: QuickActionsProps) {
  const actions = [
    {
      title: "Create Goal",
      description: "Set a new personal or group goal",
      icon: Target,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400",
      action: onCreateGoal,
    },
    {
      title: "Join Group",
      description: "Connect with friends and family",
      icon: Users,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400",
      action: onJoinGroup,
    },
    {
      title: "Quick Update",
      description: "Log progress on existing goals",
      icon: TrendingUp,
      color: "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400",
      action: () => {}, // Add functionality later
    },
    {
      title: "Set Reminder",
      description: "Never miss a milestone",
      icon: Calendar,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400",
      action: () => {}, // Add functionality later
    },
  ];

  return (
    <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-xl">Quick Actions</CardTitle>
        </div>
        <CardDescription>Get things done faster with these shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className="group flex flex-col items-start space-y-2 rounded-lg border bg-background p-4 text-left transition-all hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", action.color)}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="pt-2">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{action.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}