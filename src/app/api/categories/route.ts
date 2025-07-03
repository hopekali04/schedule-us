import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-helper";
import { Timestamp } from "firebase-admin/firestore";

// GET all categories
export async function GET(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const categoriesSnapshot = await adminDb.collection('categories').where('deletedAt', '==', null).get();
        const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST a new category
export async function POST(request: NextRequest) {
    const userId = await getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, description, color } = await request.json();
        if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 });

        const newCategory = {
            name,
            description: description || '',
            color: color || '',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            deletedAt: null,
        };

        const categoryRef = await adminDb.collection('categories').add(newCategory);
        return NextResponse.json({ id: categoryRef.id, ...newCategory }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}