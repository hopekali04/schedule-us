import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-helper";
import { Timestamp } from "firebase-admin/firestore";

// GET a single category by ID
export async function GET(
  request: NextRequest, 
  { params }: { params: { categoryId: string } }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId } = params;
    const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();
    const categoryData = categoryDoc.data();

    if (!categoryDoc.exists || categoryData?.deletedAt) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    if (categoryData?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }
    return NextResponse.json({ id: categoryDoc.id, ...categoryData }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching category:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH (update) a category by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId } = params;
    const { name, description, color } = await request.json();
    const categoryRef = adminDb.collection('categories').doc(categoryId);
    const categoryDoc = await categoryRef.get();
    const categoryData = categoryDoc.data();

    if (!categoryDoc.exists || categoryData?.deletedAt) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    if (categoryData?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const updatedData: { [key: string]: unknown } = { updatedAt: Timestamp.now() };
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (color) updatedData.color = color;

    await categoryRef.update(updatedData);
    return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error updating category:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE (soft delete) a category by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { categoryId } = params;
    const categoryRef = adminDb.collection('categories').doc(categoryId);
    const categoryDoc = await categoryRef.get();
    const categoryData = categoryDoc.data();

    if (!categoryDoc.exists || categoryData?.deletedAt) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    if (categoryData?.userId !== userId) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    await categoryRef.update({ deletedAt: Timestamp.now() });
    return NextResponse.json({ message: 'Category soft deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting category`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
