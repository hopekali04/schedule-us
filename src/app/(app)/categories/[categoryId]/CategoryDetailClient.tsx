"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Edit3, Trash2, Eye, BarChart3, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';

// Serializable category interface for client component
interface SerializableCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface CategoryDetailClientProps {
  category: SerializableCategory;
  goalsCount: {
    total: number;
    active: number;
    completed: number;
  };
}

export function CategoryDetailClient({ category, goalsCount }: CategoryDetailClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSoftDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Category moved to trash successfully');
        router.push('/categories');
      } else {
        const error = await response.text();
        toast.error(`Failed to delete category: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const completionRate = goalsCount.total > 0 
    ? Math.round((goalsCount.completed / goalsCount.total) * 100) 
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: category.color || '#6B7280' }}
            ></div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {category.name}
            </h1>
          </div>
        </div>
        
        {category.description && (
          <p className="text-lg text-gray-600 mb-6">{category.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created {formatDate(category.createdAt)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {goalsCount.total} Goals
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {completionRate}% Complete
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => router.push(`/categories/${category.id}/goals`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View All Goals
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push(`/categories/${category.id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Category
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Category
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will move the category &quot;{category.name}&quot; to trash. You can restore it later from the deleted categories section. 
                  Goals in this category will not be affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSoftDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? 'Deleting...' : 'Move to Trash'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsCount.total}</div>
            <p className="text-xs text-muted-foreground">
              Goals in this category
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{goalsCount.active}</div>
            <p className="text-xs text-muted-foreground">
              Goals in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{goalsCount.completed}</div>
            <p className="text-xs text-muted-foreground">
              Goals finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
          <CardDescription>
            Summary information about this category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm text-muted-foreground">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(category.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for this category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/categories/${category.id}/goals`)}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              View Goals
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Create Goal in Category
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Browse All Categories
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}