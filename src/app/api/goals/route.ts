// app/api/goals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';
import { getGoalsWithProgress } from '@/lib/goal-helper';

// CREATE a new goal
export async function POST(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, description, startAt, endAt, groupId, steps } = await request.json();

        if (!name || !startAt || !endAt || !groupId || !Array.isArray(steps)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const memberQuery = await adminDb.collection('group_members').where('userId', '==', userId).where('groupId', '==', groupId).limit(1).get();
        if (memberQuery.empty) {
            return NextResponse.json({ error: 'Forbidden: You are not a member of this group.' }, { status: 403 });
        }

        const batch = adminDb.batch();
        const goalRef = adminDb.collection('goals').doc();

        batch.set(goalRef, {
            name,
            description: description || '',
            startAt: new Date(startAt),
            endAt: new Date(endAt),
            groupId,
            isCompleted: false, // NEW
            isClosed: false,    // NEW
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            deletedAt: null,
        });

        steps.forEach((step: { description: string }, index: number) => {
            const stepRef = adminDb.collection('goal_steps').doc();
            batch.set(stepRef, {
                goalId: goalRef.id,
                description: step.description,
                stepNumber: index + 1,
                isCompleted: false,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                deletedAt: null,
            });
        });

        await batch.commit();
        return NextResponse.json({ message: 'Goal created successfully', goalId: goalRef.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating goal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET all goals for the current user
export async function GET(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const memberQuery = await adminDb.collection('group_members').where('userId', '==', userId).get();
        const groupIds = memberQuery.docs.map(doc => doc.data().groupId);

        if (groupIds.length === 0) return NextResponse.json([], { status: 200 });

        let goalsQuery = adminDb.collection('goals')
            .where('groupId', 'in', groupIds)
            .where('deletedAt', '==', null);

        // Add category filter if provided
        if (categoryId) {
            goalsQuery = goalsQuery.where('categoryId', '==', categoryId);
        }

        const querySnapshot = await goalsQuery.get();
        
        const goalsWithProgress = await getGoalsWithProgress(querySnapshot.docs);
        return NextResponse.json(goalsWithProgress, { status: 200 });
    } catch (error) {
        console.error('Error fetching goals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}