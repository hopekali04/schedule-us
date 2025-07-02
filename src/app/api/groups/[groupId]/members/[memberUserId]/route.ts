// app/api/groups/[groupId]/members/[memberUserId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';

// Remove a member from a group (soft delete)
export async function DELETE(request: NextRequest, 
    { params }: { params: Promise<{ groupId: string; memberUserId: string }> }) {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await the params since it's now a Promise
    const { groupId, memberUserId } = await params;

    try {
        const groupDoc = await adminDb.collection('groups').doc(groupId).get();
        if (!groupDoc.exists) return NextResponse.json({ error: 'Group not found' }, { status: 404 });

        const isCreator = groupDoc.data()?.createdBy === currentUserId;
        const isSelf = currentUserId === memberUserId;

        if (!isCreator && !isSelf) {
            return NextResponse.json({ error: 'Forbidden: You can only remove yourself or be removed by the creator.' }, { status: 403 });
        }

        const memberQuery = await adminDb.collection('group_members')
            .where('groupId', '==', groupId)
            .where('userId', '==', memberUserId)
            .limit(1)
            .get();
        
        if (memberQuery.empty) {
            return NextResponse.json({ error: 'Member not found in this group' }, { status: 404 });
        }

        // We can't soft-delete here because the unique constraint is on the fields.
        // A real delete is more appropriate for a membership link.
        const memberDocId = memberQuery.docs[0].id;
        await adminDb.collection('group_members').doc(memberDocId).delete();

        return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}