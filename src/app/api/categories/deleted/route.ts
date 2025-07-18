import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-helper";
import { Timestamp } from "firebase-admin/firestore";

// GET deleted categories
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const categoriesSnapshot = await adminDb
      .collection('categories')
      .where('userId', '==', userId)
      .where('deletedAt', '!=', null)
      .orderBy('deletedAt', 'desc')
      .get();

    const deletedCategories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(deletedCategories, { status: 200 });
  } catch (error) {
    console.error('Error fetching deleted categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST restore a deleted category
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId } = await request.json();
    
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categoryRef = adminDb.collection('categories').doc(categoryId);
    const categoryDoc = await categoryRef.get();
    const categoryData = categoryDoc.data();

    if (!categoryDoc.exists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    if (categoryData?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    if (!categoryData?.deletedAt) {
      return NextResponse.json({ error: 'Category is not deleted' }, { status: 400 });
    }

    // Restore the category by removing deletedAt and updating updatedAt
    await categoryRef.update({
      deletedAt: null,
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({ message: 'Category restored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error restoring category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}