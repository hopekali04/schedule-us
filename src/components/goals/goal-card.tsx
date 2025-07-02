// components/goals/goal-card.tsx
import { GoalWithProgress } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface GoalCardProps {
  goal: GoalWithProgress;
  onClick: () => void;
}

export default function GoalCard({ goal, onClick }: GoalCardProps) {
  const getStatusColor = () => {
    switch (goal.status) {
      case "On Track": return "bg-green-100 text-green-800";
      case "At Risk": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
                 <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: goal.color }} />
                <CardTitle className="text-lg font-semibold leading-tight tracking-tight">
                    {goal.name}
                </CardTitle>
            </div>
            <Badge className={`px-2 py-1 text-xs font-medium ${getStatusColor()}`}>
                {goal.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Progress</span>
            <span>{goal.progressPercentage}%</span>
          </div>
          <Progress value={goal.progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{`${goal.completedSteps} / ${goal.totalSteps} steps`}</span>
            <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3"/>
                <span>{goal.daysLeft} days left</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}