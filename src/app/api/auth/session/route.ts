// app/api/auth/session/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// This function handles session creation (login/signup)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken as string;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie. This also verifies the ID token.
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // --- NEW LOGIC: Check for user and create if not exists ---
    const userRef = adminDb.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // User is new, create their user doc and personal group
      const userEmail = decodedToken.email;
      if (!userEmail) {
        throw new Error("Email not found in token for new user.");
      }

      // Use a transaction to ensure atomicity
      await adminDb.runTransaction(async (transaction) => {
        // 1. Create User Document
        transaction.set(userRef, {
          email: userEmail,
          isActive: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          deletedAt: null,
        });

        // 2. Create their personal '<self>' group
        const groupRef = adminDb.collection('groups').doc(); // Auto-generate ID
        transaction.set(groupRef, {
          name: '<self>',
          description: 'Personal goals for this user.',
          createdBy: decodedToken.uid,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          deletedAt: null,
        });

        // 3. Add them as a member of their own group
        const groupMemberRef = adminDb.collection('group_members').doc(); // Auto-generate ID
        transaction.set(groupMemberRef, {
          userId: decodedToken.uid,
          groupId: groupRef.id,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          deletedAt: null,
        });
      });
      console.log(`Successfully created user profile and self-group for UID: ${decodedToken.uid}`);
    }
    // --- END OF NEW LOGIC ---

    (await
      cookies()).set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Session Login Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(request: NextRequest) {
  try {
    // Clear the session cookie
    (await
          // Clear the session cookie
          cookies()).set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Session Logout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}