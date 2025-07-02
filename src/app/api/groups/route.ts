// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue, FieldPath } from 'firebase-admin/firestore';
import { Group } from '@/types/types';

// CREATE a new group
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const batch = adminDb.batch();
    
    // 1. Create the group
    const groupRef = adminDb.collection('groups').doc();
    batch.set(groupRef, {
      name,
      description: description || '',
      createdBy: userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null,
    });

    // 2. Add the creator as the first member
    const memberRef = adminDb.collection('group_members').doc();
    batch.set(memberRef, {
        groupId: groupRef.id,
        userId: userId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        deletedAt: null,
    });
    
    await batch.commit();

    return NextResponse.json({ message: 'Group created successfully', groupId: groupRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET all groups a user belongs to
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const memberQuery = await adminDb.collection('group_members')
        .where('userId', '==', userId)
        .where('deletedAt', '==', null)
        .get();
        
    const groupIds = memberQuery.docs.map(doc => doc.data().groupId);

    if (groupIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
    const groupsQuery = await adminDb.collection('groups')
        .where(FieldPath.documentId(), 'in', groupIds)
        .get();
        
    const groups = groupsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Group[];
    return NextResponse.json(groups, { status: 200 });

  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}