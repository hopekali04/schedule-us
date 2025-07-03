import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-helper";

// GET all categories
export async function GET(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const categoriesSnapshot = await adminDb.collection('categories').get();
        // console.log('Fetched categories:', categoriesSnapshot.docs);
        const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}