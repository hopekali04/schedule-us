/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/goal-helper.ts
import { adminDb } from '@/lib/firebase-admin';
import { Goal, GoalStep, GoalProgressData, GoalWithProgress } from '@/types/types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

export function calculateGoalProgress(goal: Goal, steps: GoalStep[]): GoalProgressData {
    // Check top-level flags first
    if (goal.isClosed) {
        return { progressPercentage: 100, completedSteps: 0, totalSteps: 0, daysLeft: 0, totalDurationDays: 0, status: 'Closed' };
    }
    if (goal.isCompleted) {
        return { progressPercentage: 100, completedSteps: steps.length, totalSteps: steps.length, daysLeft: 0, totalDurationDays: 0, status: 'Completed' };
    }
    
    const totalSteps = steps.length;
    if (totalSteps === 0) {
        return { progressPercentage: 0, completedSteps: 0, totalSteps: 0, daysLeft: 0, totalDurationDays: 0, status: 'Not Started' };
    }

    const completedSteps = steps.filter(step => step.isCompleted).length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

    const now = new Date();
    // Handle both Date objects and Firestore timestamps
    const start = goal.startAt instanceof Date ? goal.startAt : (goal.startAt as any)?.toDate();
    const end = goal.endAt instanceof Date ? goal.endAt : (goal.endAt as any)?.toDate();

    const totalDurationMs = end.getTime() - start.getTime();
    const totalDurationDays = Math.max(0, Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24)));
    
    const remainingMs = end.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

    let status: GoalProgressData['status'] = 'On Track';
    if (now > end) {
        status = 'Overdue';
    } else if (daysLeft < totalDurationDays * 0.25) { // If less than 25% of time is left
        status = 'At Risk';
    }

    return {
        progressPercentage,
        completedSteps,
        totalSteps,
        daysLeft,
        totalDurationDays,
        status,
    };
}

export async function getGoalsWithProgress(goalDocs: QueryDocumentSnapshot<DocumentData>[]): Promise<GoalWithProgress[]> {
    if (goalDocs.length === 0) return [];
    
    const goalIds = goalDocs.map(doc => doc.id);
    const goalsData = goalDocs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to JavaScript Date objects
            startAt: data.startAt?.toDate ? data.startAt.toDate() : data.startAt,
            endAt: data.endAt?.toDate ? data.endAt.toDate() : data.endAt,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate() : null,
        } as Goal;
    });

    const stepsQuery = await adminDb.collection('goal_steps')
        .where('goalId', 'in', goalIds)
        .where('deletedAt', '==', null) // Only get non-deleted steps
        .get();
    const allSteps = stepsQuery.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to JavaScript Date objects for steps too
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate() : null,
        } as GoalStep;
    });

    return goalsData.map(goal => {
        const relevantSteps = allSteps.filter(step => step.goalId === goal.id);
        const progressData = calculateGoalProgress(goal, relevantSteps);
        
        return {
            ...goal,
            ...progressData,
            steps: relevantSteps,
        };
    });
}