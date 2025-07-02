// app/api/groups/[groupId]/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';

// Add a new member to a group
export async function POST(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await the params since it's now a Promise
    const { groupId } = await params;

    try {
        const groupDoc = await adminDb.collection('groups').doc(groupId).get();
        if (!groupDoc.exists || groupDoc.data()?.createdBy !== currentUserId) {
            return NextResponse.json({ error: 'Forbidden: Only group creator can add members.' }, { status: 403 });
        }

        const { email } = await request.json();
        if (!email) return NextResponse.json({ error: 'User email is required' }, { status: 400 });

        // Find user by email
        const userQuery = await adminDb.collection('users').where('email', '==', email).limit(1).get();
        if (userQuery.empty) {
            return NextResponse.json({ error: 'User with this email not found' }, { status: 404 });
        }
        const userToAddId = userQuery.docs[0].id;

        // Check if user is already a member
        const memberQuery = await adminDb.collection('group_members')
            .where('groupId', '==', groupId)
            .where('userId', '==', userToAddId)
            .get();

        if (!memberQuery.empty) {
            return NextResponse.json({ error: 'User is already a member of this group' }, { status: 409 });
        }

        // Add the new member
        await adminDb.collection('group_members').add({
            groupId: groupId,
            userId: userToAddId,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            deletedAt: null,
        });

        return NextResponse.json({ message: 'Member added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}