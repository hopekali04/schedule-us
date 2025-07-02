// app/api/groups/[groupId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';
// import { Group, GroupMember } from '@/types/types';

async function isGroupCreator(userId: string, groupId: string): Promise<boolean> {
    const groupDoc = await adminDb.collection('groups').doc(groupId).get();
    return groupDoc.exists && groupDoc.data()?.createdBy === userId;
}

// UPDATE a group
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await the params since it's now a Promise
    const { groupId } = await params;

    if (!await isGroupCreator(userId, groupId)) {
        return NextResponse.json({ error: 'Forbidden: Only the group creator can edit.' }, { status: 403 });
    }

    try {
        const { name, description } = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: { [key: string]: any } = { updatedAt: FieldValue.serverTimestamp() };
        if (name) updateData.name = name;
        if (description) updateData.description = description;

        await adminDb.collection('groups').doc(groupId).update(updateData);
        return NextResponse.json({ message: 'Group updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE (soft) a group
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await the params since it's now a Promise
    const { groupId } = await params;

    if (!await isGroupCreator(userId, groupId)) {
        return NextResponse.json({ error: 'Forbidden: Only the group creator can delete.' }, { status: 403 });
    }

    try {
        // Note: This only soft-deletes the group. Associated goals are not deleted.
        // You might want a more complex cleanup function depending on your business logic.
        await adminDb.collection('groups').doc(groupId).update({
            deletedAt: FieldValue.serverTimestamp()
        });
        return NextResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}