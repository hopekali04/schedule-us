// app/api/goals/[goalId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';

// Authorization helper
async function canUserAccessGoal(userId: string, goalId: string): Promise<boolean> {
    const goalDoc = await adminDb.collection('goals').doc(goalId).get();
    if (!goalDoc.exists) return false;
    const groupId = goalDoc.data()?.groupId;
    const memberQuery = await adminDb.collection('group_members').where('userId', '==', userId).where('groupId', '==', groupId).limit(1).get();
    return !memberQuery.empty;
}

// UPDATE a goal's properties (including completion status)
export async function PATCH(request: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!await canUserAccessGoal(userId, params.goalId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, description, startAt, endAt, isCompleted, isClosed } = body;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: { [key: string]: any } = { updatedAt: FieldValue.serverTimestamp() };

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (startAt) updateData.startAt = new Date(startAt);
        if (endAt) updateData.endAt = new Date(endAt);
        if (typeof isCompleted === 'boolean') updateData.isCompleted = isCompleted;
        if (typeof isClosed === 'boolean') updateData.isClosed = isClosed;

        if (Object.keys(updateData).length <= 1) {
            return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
        }

        await adminDb.collection('goals').doc(params.goalId).update(updateData);
        return NextResponse.json({ message: 'Goal updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating goal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE (soft) a goal
export async function DELETE(request: NextRequest, { params }: { params: { goalId: string } }) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    if (!await canUserAccessGoal(userId, params.goalId)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await adminDb.collection('goals').doc(params.goalId).update({
            deletedAt: FieldValue.serverTimestamp()
        });
        return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting goal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}