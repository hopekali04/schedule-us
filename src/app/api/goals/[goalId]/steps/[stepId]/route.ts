// app/api/goals/[goalId]/steps/[stepId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string; stepId: string }> }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await the params since it's now a Promise
  const { goalId, stepId } = await params;
  const { isCompleted } = await request.json();

  if (typeof isCompleted !== 'boolean') {
    return NextResponse.json({ error: 'isCompleted must be a boolean' }, { status: 400 });
  }

  try {
    // Authorization check: Ensure user can modify this goal
    const goalDoc = await adminDb.collection('goals').doc(goalId).get();
    if (!goalDoc.exists) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const groupId = goalDoc.data()?.groupId;
    const memberQuery = await adminDb.collection('group_members')
        .where('userId', '==', userId)
        .where('groupId', '==', groupId)
        .limit(1).get();

    if (memberQuery.empty) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the step
    const stepRef = adminDb.collection('goal_steps').doc(stepId);
    await stepRef.update({
      isCompleted,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'Step updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating step:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}