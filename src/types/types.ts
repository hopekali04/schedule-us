// lib/types.ts
import { Timestamp } from 'firebase-admin/firestore';

// Base document structure
interface BaseDoc {
  id: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  deletedAt?: Timestamp | Date | null;
}

// Firestore Collection Types
export interface User extends Omit<BaseDoc, 'id'> {
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

export interface Group extends BaseDoc {
  name: string;
  description?: string;
  createdBy: string; // User UID
}

export interface Categories extends BaseDoc {
  name: string;
  description?: string;
  color?: string; 
}

export interface GroupMember extends BaseDoc { // Now extends BaseDoc to have its own ID
  groupId: string;
  userId: string;
}

export interface Goal extends BaseDoc {
  name: string;
  description?: string;
  startAt: Timestamp | Date | string;
  endAt: Timestamp | Date | string;
  groupId: string;
  categoryId?: string;
  color?: string;
  isCompleted: boolean; // NEW
  isClosed: boolean;    // NEW
}

export interface GoalStep extends BaseDoc {
  goalId: string;
  description: string;
  stepNumber: number;
  isCompleted: boolean;
}

export interface ChatMessage extends BaseDoc {
  groupId: string;
  userId: string;
  userDisplayName: string;
  message: string;
}

export interface Reminder extends BaseDoc {
  userId: string;
  goalId: string;
  goalName: string;
  reminderType: 'check-progress' | 'deadline-approaching' | 'next-step' | 'milestone';
  scheduledAt: Timestamp | Date | string;
  isEmailSent: boolean;
  isCompleted: boolean;
}

// API Response Types (User-Friendly JSON)
export interface GoalProgressData {
  progressPercentage: number;
  completedSteps: number;
  totalSteps: number;
  daysLeft: number;
  totalDurationDays: number;
  status: 'Completed' | 'On Track' | 'At Risk' | 'Overdue' | 'Not Started' | 'Closed';
}

export interface GoalWithProgress extends Goal, GoalProgressData {
  steps: GoalStep[];
  color?: string; // Optional color for UI representation
}

// NEW: Type for the dashboard endpoint
export interface DashboardData {
  stats: {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    overdueGoals: number;
    onTrackGoals: number;
    overallProgressPercentage: number;
  };
  upcomingDeadlines: GoalWithProgress[]; // Goals due in the next 7 days
  groupPerformance: Array<{
    groupId: string;
    groupName: string;
    progressPercentage: number;
  }>
}