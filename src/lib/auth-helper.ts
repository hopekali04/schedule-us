// lib/auth-helper.ts
import { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        return decodedToken.uid;
    } catch (error) {
        console.error('Failed to verify session cookie:', error);
        return null;
    }
}