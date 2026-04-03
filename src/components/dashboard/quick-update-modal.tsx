// components/dashboard/quick-update-modal.tsx
"use client";

import { useState } from 'react';
import { GoalWithProgress } from '@/types/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateGoalStep } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: GoalWithProgress[];
}

export function QuickUpdateModal({ isOpen, onClose, goals }: QuickUpdateModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [selectedStepId, setSelectedStepId] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Filter active goals only
  const activeGoals = goals.filter(g => g.status !== 'Completed' && g.status !== 'Closed');
  const selectedGoal = activeGoals.find(g => g.id === selectedGoalId);
  const availableSteps = selectedGoal?.steps.filter(s => !s.isCompleted) || [];

  const handleUpdate = async () => {
    if (!selectedGoalId || !selectedStepId) {
      toast({
        title: 'Missing information',
        description: 'Please select a goal and step to update.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateGoalStep(selectedGoalId, selectedStepId, true);
      
      toast({
        title: 'Progress updated!',
        description: 'Your goal step has been marked as completed.',
      });
      
      handleClose();
      router.refresh();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGoalId('');
    setSelectedStepId('');
    setUpdateNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Progress Update
          </DialogTitle>
          <DialogDescription>
            Mark a step as completed to log progress on your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-select">Select Goal</Label>
            <Select value={selectedGoalId} onValueChange={(value) => {
              setSelectedGoalId(value);
              setSelectedStepId(''); // Reset step selection when goal changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a goal to update" />
              </SelectTrigger>
              <SelectContent>
                {activeGoals.length > 0 ? (
                  activeGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No active goals available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedGoal && (
            <div className="space-y-2">
              <Label htmlFor="step-select">Select Step to Complete</Label>
              <Select value={selectedStepId} onValueChange={setSelectedStepId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a step to mark complete" />
                </SelectTrigger>
                <SelectContent>
                  {availableSteps.length > 0 ? (
                    availableSteps.map((step) => (
                      <SelectItem key={step.id} value={step.id}>
                        {step.description}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>All steps completed!</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Update Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this progress update..."
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              rows={3}
            />
          </div>

          {selectedGoal && availableSteps.length === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">All steps completed!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                This goal has all steps marked as complete.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isLoading || !selectedGoalId || !selectedStepId || availableSteps.length === 0}
          >
            {isLoading ? 'Updating...' : 'Update Progress'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}