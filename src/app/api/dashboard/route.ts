/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldPath } from 'firebase-admin/firestore';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { getGoalsWithProgress } from '@/lib/goal-helper';
import { DashboardData, Group } from '@/types/types';

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // 1. Get all user's groups
        const memberQuery = await adminDb.collection('group_members').where('userId', '==', userId).get();
        const groupIds = memberQuery.docs.map(doc => doc.data().groupId);
        if (groupIds.length === 0) {
            return NextResponse.json({ stats: { totalGoals: 0, completedGoals: 0, inProgressGoals: 0, overdueGoals: 0, onTrackGoals: 0, overallProgressPercentage: 0 }, upcomingDeadlines: [], groupPerformance: [] });
        }
        const groupsQuery = await adminDb.collection('groups').where(FieldPath.documentId(), 'in', groupIds).get();
        // const groupsQuery = await adminDb.collection('groups').where(adminDb.FieldPath.documentId(), 'in', groupIds).get();
        const groups = groupsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Group[];

        // 2. Get all goals for those groups
        const goalsQuery = await adminDb.collection('goals').where('groupId', 'in', groupIds).where('deletedAt', '==', null).get();
        const allGoals = await getGoalsWithProgress(goalsQuery.docs);

        // 3. Calculate Stats
        const now = new Date();
        const oneWeekFromNow = new Date(now.setDate(now.getDate() + 7));
        
        let completedGoals = 0;
        let overdueGoals = 0;
        let onTrackGoals = 0;
        let totalProgress = 0;
        let inProgressCount = 0;

        allGoals.forEach(goal => {
            if (goal.status === 'Completed' || goal.status === 'Closed') {
                completedGoals++;
            } else {
                inProgressCount++;
                totalProgress += goal.progressPercentage;
                if (goal.status === 'Overdue') overdueGoals++;
                if (goal.status === 'On Track' || goal.status === 'At Risk') onTrackGoals++;
            }
        });

        const dashboardData: DashboardData = {
            stats: {
                totalGoals: allGoals.length,
                completedGoals: completedGoals,
                inProgressGoals: onTrackGoals + overdueGoals,
                overdueGoals: overdueGoals,
                onTrackGoals: onTrackGoals,
                overallProgressPercentage: inProgressCount > 0 ? Math.round(totalProgress / inProgressCount) : 0,
            },
            upcomingDeadlines: allGoals.filter(goal => {
                const endDate = (goal.endAt as any).toDate();
                return goal.status !== 'Completed' && goal.status !== 'Closed' && endDate <= oneWeekFromNow && endDate > new Date();
            }),
            groupPerformance: groups.map(group => {
                const groupGoals = allGoals.filter(g => g.groupId === group.id);
                const total = groupGoals.length;
                if (total === 0) return { groupId: group.id, groupName: group.name, progressPercentage: 0 };
                const groupProgressSum = groupGoals.reduce((acc, g) => acc + g.progressPercentage, 0);
                return {
                    groupId: group.id,
                    groupName: group.name,
                    progressPercentage: Math.round(groupProgressSum / total),
                }
            })
        };

        return NextResponse.json(dashboardData, { status: 200 });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}