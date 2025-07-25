// app/api/groups/[groupId]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';

// Generate an invite token for a group
export async function POST(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { groupId } = await params;

    // Check if user is a member of the group
    const memberQuery = await adminDb.collection('group_members')
      .where('userId', '==', userId)
      .where('groupId', '==', groupId)
      .where('deletedAt', '==', null)
      .limit(1)
      .get();

    if (memberQuery.empty) {
      return NextResponse.json({ error: 'Forbidden: You are not a member of this group.' }, { status: 403 });
    }

    // Check if group exists
    const groupDoc = await adminDb.collection('groups').doc(groupId).get();
    if (!groupDoc.exists) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Generate a unique invite token
    const inviteToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Store the invite in the database
    const inviteRef = adminDb.collection('group_invites').doc();
    await inviteRef.set({
      groupId,
      email,
      invitedBy: userId,
      token: inviteToken,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Return the invite link
    const inviteLink = `${request.nextUrl.origin}/invite/${inviteToken}`;

    return NextResponse.json({ 
      inviteLink,
      message: 'Invite created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating invite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}