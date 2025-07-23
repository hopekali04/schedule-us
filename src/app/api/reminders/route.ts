// app/api/reminders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { FieldValue } from 'firebase-admin/firestore';
import { sendReminderEmail } from '@/lib/email-service';

// CREATE a new reminder
export async function POST(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { goalId, reminderType, scheduledAt } = await request.json();

        if (!goalId || !reminderType || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify the goal exists and user has access to it
        const goalDoc = await adminDb.collection('goals').doc(goalId).get();
        if (!goalDoc.exists) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const goalData = goalDoc.data();
        if (!goalData) {
            return NextResponse.json({ error: 'Goal data not found' }, { status: 404 });
        }

        // Check if user is a member of the goal's group
        const memberQuery = await adminDb
            .collection('group_members')
            .where('userId', '==', userId)
            .where('groupId', '==', goalData.groupId)
            .limit(1)
            .get();

        if (memberQuery.empty) {
            return NextResponse.json({ error: 'Forbidden: You are not a member of this group.' }, { status: 403 });
        }

        // Get user information for email
        const userDoc = await adminDb.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const userEmail = userData?.email || '';
        const userName = userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'User';

        // Create the reminder
        const reminderRef = adminDb.collection('reminders').doc();
        await reminderRef.set({
            userId,
            goalId,
            goalName: goalData.name,
            reminderType,
            scheduledAt: new Date(scheduledAt),
            isEmailSent: false,
            isCompleted: false,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            deletedAt: null,
        });

        // Calculate days left for the goal
        const goalEndDate = goalData.endAt.toDate ? goalData.endAt.toDate() : new Date(goalData.endAt);
        const today = new Date();
        const timeDiff = goalEndDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Send immediate confirmation email
        if (userEmail) {
            try {
                await sendReminderEmail({
                    email: userEmail,
                    userName,
                    goalName: goalData.name,
                    reminderType,
                    goalEndDate: goalEndDate.toLocaleDateString(),
                    daysLeft: Math.max(0, daysLeft)
                });

                // Update reminder to mark email as sent
                await reminderRef.update({
                    isEmailSent: true,
                    updatedAt: FieldValue.serverTimestamp(),
                });
            } catch (emailError) {
                console.error('Failed to send reminder email:', emailError);
                // Don't fail the request if email fails, just log it
            }
        }

        return NextResponse.json({ 
            id: reminderRef.id,
            message: 'Reminder created successfully',
            emailSent: !!userEmail
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating reminder:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET reminders for the authenticated user
export async function GET(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const remindersQuery = await adminDb
            .collection('reminders')
            .where('userId', '==', userId)
            .where('deletedAt', '==', null)
            .orderBy('scheduledAt', 'asc')
            .get();

        const reminders = remindersQuery.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                scheduledAt: data.scheduledAt?.toDate ? data.scheduledAt.toDate() : data.scheduledAt,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate() : null,
            };
        });

        return NextResponse.json({ reminders }, { status: 200 });

    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}