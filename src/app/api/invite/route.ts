// app/api/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';

// Get invite details by token
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const inviteQuery = await adminDb.collection('group_invites')
      .where('token', '==', token)
      .where('status', '==', 'pending')
      .limit(1)
      .get();

    if (inviteQuery.empty) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });
    }

    const inviteDoc = inviteQuery.docs[0];
    const inviteData = inviteDoc.data();

    // Check if invite has expired
    const expiresAt = inviteData.expiresAt?.toDate ? inviteData.expiresAt.toDate() : new Date(inviteData.expiresAt);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invite has expired' }, { status: 410 });
    }

    // Get group details
    const groupDoc = await adminDb.collection('groups').doc(inviteData.groupId).get();
    if (!groupDoc.exists) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const groupData = groupDoc.data();

    return NextResponse.json({
      group: {
        id: groupDoc.id,
        name: groupData?.name,
        description: groupData?.description,
      },
      email: inviteData.email,
      inviteId: inviteDoc.id,
    });

  } catch (error) {
    console.error('Error fetching invite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Accept or decline invite
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { inviteId, action } = await request.json();
    
    if (!inviteId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const inviteDoc = await adminDb.collection('group_invites').doc(inviteId).get();
    if (!inviteDoc.exists) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    const inviteData = inviteDoc.data();
    if (inviteData?.status !== 'pending') {
      return NextResponse.json({ error: 'Invite already processed' }, { status: 409 });
    }

    // Check if invite has expired
    const expiresAt2 = inviteData.expiresAt?.toDate ? inviteData.expiresAt.toDate() : new Date(inviteData.expiresAt);
    if (expiresAt2 < new Date()) {
      return NextResponse.json({ error: 'Invite has expired' }, { status: 410 });
    }

    const batch = adminDb.batch();

    if (action === 'accept') {
      // Check if user is already a member
      const existingMemberQuery = await adminDb.collection('group_members')
        .where('userId', '==', userId)
        .where('groupId', '==', inviteData.groupId)
        .where('deletedAt', '==', null)
        .limit(1)
        .get();

      if (!existingMemberQuery.empty) {
        return NextResponse.json({ error: 'You are already a member of this group' }, { status: 409 });
      }

      // Add user to group
      const memberRef = adminDb.collection('group_members').doc();
      batch.set(memberRef, {
        groupId: inviteData.groupId,
        userId: userId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        deletedAt: null,
      });
    }

    // Update invite status
    batch.update(inviteDoc.ref, {
      status: action === 'accept' ? 'accepted' : 'declined',
      processedBy: userId,
      processedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ 
      message: `Invite ${action}ed successfully`,
      groupId: action === 'accept' ? inviteData.groupId : null
    });

  } catch (error) {
    console.error('Error processing invite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}