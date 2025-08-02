"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeletedCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date | { toDate(): Date } | string;
  updatedAt: Date | { toDate(): Date } | string;
  deletedAt: Date | { toDate(): Date } | string;
}

function DeletedCategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center mt-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="ml-2 h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeletedCategoriesClient() {
  const [deletedCategories, setDeletedCategories] = useState<DeletedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDeletedCategories();
  }, []);

  const fetchDeletedCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories/deleted');
      if (response.ok) {
        const data = await response.json();
        setDeletedCategories(data);
      } else {
        console.error('Failed to fetch deleted categories');
        setDeletedCategories([]);
      }
    } catch (error) {
      console.error('Error fetching deleted categories:', error);
      setDeletedCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (categoryId: string) => {
    setRestoring(categoryId);
    try {
      const response = await fetch('/api/categories/deleted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      });

      if (response.ok) {
        toast.success('Category restored successfully');
        fetchDeletedCategories(); // Refresh the list
      } else {
        const error = await response.text();
        toast.error(`Failed to restore category: ${error}`);
      }
    } catch (error) {
      console.error('Error restoring category:', error);
      toast.error('Failed to restore category');
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (timestamp: Date | Timestamp | string | { toDate(): Date } | undefined | null) => {
    if (!timestamp) return 'Unknown';
    
    let date: Date;
    if (typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Unknown';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Deleted Categories
            </h1>
            <p className="text-gray-600">Manage and restore deleted categories</p>
          </div>
        </div>
        <Button 
          onClick={fetchDeletedCategories}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <DeletedCategoriesSkeleton />
      ) : deletedCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted categories</h3>
            <p className="text-gray-500 mb-6">
              You haven&apos;t deleted any categories yet. When you delete categories, they&apos;ll appear here and can be restored.
            </p>
            <Button onClick={() => router.push('/categories')}>
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {deletedCategories.length} deleted categor{deletedCategories.length === 1 ? 'y' : 'ies'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deletedCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  {category.description && (
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Badge variant="destructive" className="text-xs">
                      Deleted {formatDate(category.deletedAt)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Created: {formatDate(category.createdAt)}</div>
                    <div>Updated: {formatDate(category.updatedAt)}</div>
                  </div>

                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="w-full flex items-center gap-2"
                          disabled={restoring === category.id}
                        >
                          <RotateCcw className="h-4 w-4" />
                          {restoring === category.id ? 'Restoring...' : 'Restore Category'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Restore Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to restore &quot;{category.name}&quot;? 
                            This will make the category active again and it will appear in your categories list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRestore(category.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Restore
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}