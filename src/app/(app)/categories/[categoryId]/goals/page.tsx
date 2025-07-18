// app/(app)/categories/[categoryId]/goals/page.tsx
import { CategoryGoalsClient } from './CategoryGoalsClient';
import { adminDb } from '@/lib/firebase-admin';
import { Categories } from '@/types/types';

interface CategoryGoalsPageProps {
  params: Promise<{ categoryId: string }>;
}

async function getCategoryData(categoryId: string): Promise<Categories | null> {
  try {
    const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();
    
    if (!categoryDoc.exists) {
      return null;
    }

    return { id: categoryDoc.id, ...categoryDoc.data() } as Categories;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function CategoryGoalsPage({ params }: CategoryGoalsPageProps) {
  const { categoryId } = await params;
  
  const category = await getCategoryData(categoryId);
  
  if (!category) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
        <p className="text-gray-600 mt-2">The requested category could not be found.</p>
      </div>
    );
  }

  return <CategoryGoalsClient category={category} />;
}