// components/goals/goal-preview-modal.tsx
"use client";

import { GoalWithProgress } from "@/types/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Calendar, Edit, Flag, Trash2 } from "lucide-react";
import { deleteGoal, updateGoalStep } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface GoalPreviewModalProps {
  goal: GoalWithProgress | null;
  onClose: () => void;
  onEdit: (goal: GoalWithProgress) => void;
}

export default function GoalPreviewModal({ goal, onClose, onEdit }: GoalPreviewModalProps) {
  const router = useRouter();

  if (!goal) return null;
  
  const handleStepToggle = async (stepId: string, currentStatus: boolean) => {
    try {
        await updateGoalStep(goal.id, stepId, !currentStatus);
        router.refresh();
    } catch (error) {
        console.error("Failed to update step", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
        try {
            await deleteGoal(goal.id);
            onClose();
            router.refresh();
        } catch (error) {
            console.error("Failed to delete goal", error);
        }
    }
  };

  return (
    <Dialog open={!!goal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="block h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
            <DialogTitle className="text-xl">{goal.name}</DialogTitle>
          </div>
          <DialogDescription>{goal.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm"><Label>Overall Progress</Label><span className="font-semibold">{goal.progressPercentage}%</span></div>
            <Progress value={goal.progressPercentage} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><Flag className="h-3 w-3"/><span>{`${goal.completedSteps}/${goal.totalSteps} steps`}</span></div>
            <div className="flex items-center gap-1"><Calendar className="h-3 w-3"/><span>Due in {goal.daysLeft} days</span></div>
          </div>
          <div className="space-y-3">
            <Label>Steps</Label>
            {goal.steps
              .sort((a: { stepNumber: number; }, b: { stepNumber: number; }) => a.stepNumber - b.stepNumber)
              .filter((step: { id: Key | null | undefined; }) => typeof step.id === "string" && step.id)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((step: { id: string; isCompleted: boolean; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <div key={step.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                    <Checkbox id={`step-${step.id}`} checked={step.isCompleted} onCheckedChange={() => handleStepToggle(step.id, step.isCompleted)} />
                    <label htmlFor={`step-${step.id}`} className={`text-sm font-medium leading-none ${step.isCompleted ? 'line-through text-muted-foreground' : ''}`}>{step.description}</label>
                </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(goal)}><Edit className="mr-2 h-4 w-4" /> Edit Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}