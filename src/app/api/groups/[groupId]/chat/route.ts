// app/api/groups/[groupId]/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';
import { ChatMessage } from '@/types/types';

interface RouteContext {
  params: Promise<{
    groupId: string;
  }>;
}

// GET chat messages for a group
export async function GET(request: NextRequest, context: RouteContext) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId } = await context.params;

  try {
    // First, verify the user is a member of this group
    const memberQuery = await adminDb.collection('group_members')
      .where('groupId', '==', groupId)
      .where('userId', '==', userId)
      .where('deletedAt', '==', null)
      .get();

    if (memberQuery.empty) {
      return NextResponse.json({ error: 'Access denied to this group' }, { status: 403 });
    }

    // Fetch chat messages for this group, ordered by creation time
    const messagesQuery = await adminDb.collection('chat_messages')
      .where('groupId', '==', groupId)
      .where('deletedAt', '==', null)
      .orderBy('createdAt', 'desc')
      .limit(100) // Limit to last 100 messages
      .get();

    const messages = messagesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];

    // Return messages in chronological order (oldest first)
    return NextResponse.json(messages.reverse(), { status: 200 });

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new chat message
export async function POST(request: NextRequest, context: RouteContext) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId } = await context.params;

  try {
    const { message } = await request.json();
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: 'Message too long (max 1000 characters)' }, { status: 400 });
    }

    // Verify the user is a member of this group
    const memberQuery = await adminDb.collection('group_members')
      .where('groupId', '==', groupId)
      .where('userId', '==', userId)
      .where('deletedAt', '==', null)
      .get();

    if (memberQuery.empty) {
      return NextResponse.json({ error: 'Access denied to this group' }, { status: 403 });
    }

    // Get user information for display name
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const userDisplayName = userData?.firstName && userData?.lastName 
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.email || 'Unknown User';

    // Create the chat message
    const messageRef = adminDb.collection('chat_messages').doc();
    await messageRef.set({
      groupId,
      userId,
      userDisplayName,
      message: message.trim(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deletedAt: null,
    });

    return NextResponse.json({ 
      message: 'Message sent successfully', 
      messageId: messageRef.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating chat message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}