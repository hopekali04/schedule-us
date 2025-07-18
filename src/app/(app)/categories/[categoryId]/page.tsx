import { CategoryDetailClient } from './CategoryDetailClient';
import { adminDb } from '@/lib/firebase-admin';
import { Categories } from '@/types/types';

interface CategoryDetailPageProps {
  params: Promise<{ categoryId: string }>;
}

// Serializable Category data for client component
interface SerializableCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

async function getCategoryData(categoryId: string): Promise<SerializableCategory | null> {
  try {
    const categoryDoc = await adminDb.collection('categories').doc(categoryId).get();
    
    if (!categoryDoc.exists) {
      return null;
    }

    const data = categoryDoc.data() as Omit<Categories, 'id'>;
    
    // Convert Timestamps to strings for client component
    return {
      id: categoryDoc.id,
      name: data.name,
      description: data.description,
      color: data.color,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt.toDate().toISOString(),
      deletedAt: data.deletedAt ? (data.deletedAt instanceof Date ? data.deletedAt.toISOString() : data.deletedAt.toDate().toISOString()) : null,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryGoalsCount(categoryId: string): Promise<{ total: number; active: number; completed: number }> {
  try {
    const goalsSnapshot = await adminDb.collection('goals')
      .where('categoryId', '==', categoryId)
      .where('deletedAt', '==', null)
      .get();
    
    const total = goalsSnapshot.size;
    let active = 0;
    let completed = 0;
    
    goalsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.isCompleted || data.isClosed) {
        completed++;
      } else {
        active++;
      }
    });
    
    return { total, active, completed };
  } catch (error) {
    console.error('Error fetching goals count:', error);
    return { total: 0, active: 0, completed: 0 };
  }
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryId } = await params;
  
  const [category, goalsCount] = await Promise.all([
    getCategoryData(categoryId),
    getCategoryGoalsCount(categoryId)
  ]);
  
  if (!category) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
        <p className="text-gray-600 mt-2">The requested category could not be found.</p>
      </div>
    );
  }

  return <CategoryDetailClient category={category} goalsCount={goalsCount} />;
}