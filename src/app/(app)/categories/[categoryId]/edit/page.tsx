import { EditCategoryClient } from './EditCategoryClient';
import { adminDb } from '@/lib/firebase-admin';
import { Categories } from '@/types/types';
import { Timestamp } from 'firebase-admin/firestore';

interface EditCategoryPageProps {
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

// Helper function to convert timestamp to ISO string
function timestampToISOString(timestamp: Date | Timestamp | undefined): string {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return (timestamp as Timestamp).toDate().toISOString();
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
      createdAt: timestampToISOString(data.createdAt),
      updatedAt: timestampToISOString(data.updatedAt),
      deletedAt: data.deletedAt ? timestampToISOString(data.deletedAt) : null,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
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

  return <EditCategoryClient category={category} />;
}