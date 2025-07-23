// components/dashboard/reminder-modal.tsx
"use client";

import { useState } from 'react';
import { GoalWithProgress } from '@/types/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Bell } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: GoalWithProgress[];
}

export function ReminderModal({ isOpen, onClose, goals }: ReminderModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderType, setReminderType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter active goals only
  const activeGoals = goals.filter(g => g.status !== 'Completed' && g.status !== 'Closed');
  const selectedGoal = activeGoals.find(g => g.id === selectedGoalId);

  const handleSetReminder = async () => {
    if (!selectedGoalId || !reminderDate || !reminderTime || !reminderType) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields to set a reminder.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
      const now = new Date();
      
      if (reminderDateTime <= now) {
        toast({
          title: 'Invalid time',
          description: 'Please select a future date and time for the reminder.',
          variant: 'destructive',
        });
        return;
      }

      // Call the API to create the reminder
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId: selectedGoalId,
          reminderType,
          scheduledAt: reminderDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create reminder');
      }

      const result = await response.json();
      
      toast({
        title: 'Reminder set successfully!',
        description: `You'll be reminded about "${selectedGoal?.name}" on ${reminderDateTime.toLocaleDateString()} at ${reminderDateTime.toLocaleTimeString()}.${result.emailSent ? ' A confirmation email has been sent.' : ''}`,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set reminder. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedGoalId('');
    setReminderDate('');
    setReminderTime('');
    setReminderType('');
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Reminder
          </DialogTitle>
          <DialogDescription>
            Never miss a milestone! Set up a reminder for your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-select">Select Goal</Label>
            <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a goal for the reminder" />
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

          <div className="space-y-2">
            <Label htmlFor="reminder-type">Reminder Type</Label>
            <Select value={reminderType} onValueChange={setReminderType}>
              <SelectTrigger>
                <SelectValue placeholder="What to remind you about" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="check-progress">Check Progress</SelectItem>
                <SelectItem value="deadline-approaching">Deadline Approaching</SelectItem>
                <SelectItem value="next-step">Work on Next Step</SelectItem>
                <SelectItem value="milestone">Milestone Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-date">Date</Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={today}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>

          {selectedGoal && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Bell className="h-4 w-4" />
                <span className="font-medium">Goal Details</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                <strong>{selectedGoal.name}</strong>
              </p>
              <p className="text-xs text-blue-500">
                Due: {new Date(selectedGoal.endAt as Date).toLocaleDateString()} ({selectedGoal.daysLeft} days left)
              </p>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="font-medium mb-1 text-green-800">✅ Production Ready:</p>
            <p className="text-xs text-green-700">
              Reminders are now stored in the database with email notifications. 
              You&apos;ll receive confirmation emails when reminders are set.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSetReminder} 
            disabled={isLoading || !selectedGoalId || !reminderDate || !reminderTime || !reminderType}
          >
            {isLoading ? 'Setting...' : 'Set Reminder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}