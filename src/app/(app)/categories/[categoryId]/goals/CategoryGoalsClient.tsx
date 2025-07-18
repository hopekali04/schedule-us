// app/(app)/categories/[categoryId]/goals/CategoryGoalsClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { Categories, GoalWithProgress } from '@/types/types';
import GoalCard from '@/components/goals/goal-card';
import GoalPreviewModal from '@/components/goals/goal-preview-modal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CategoryGoalsClientProps {
  category: Categories;
}

function GoalsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 border rounded-lg shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function CategoryGoalsClient({ category }: CategoryGoalsClientProps) {
  const [goals, setGoals] = useState<GoalWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewingGoal, setPreviewingGoal] = useState<GoalWithProgress | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/goals?categoryId=${category.id}`);
        if (response.ok) {
          const data = await response.json();
          setGoals(data);
        } else {
          console.error('Failed to fetch goals');
          setGoals([]);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [category.id]);

  const activeGoals = goals.filter(g => g.status !== 'Completed' && g.status !== 'Closed');
  const completedGoals = goals.filter(g => g.status === 'Completed' || g.status === 'Closed');

  return (
    <>
      <GoalPreviewModal 
        goal={previewingGoal} 
        onClose={() => setPreviewingGoal(null)} 
        onEdit={() => {}} // Not implementing edit from this view for now
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
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
                style={{ backgroundColor: category.color }}
              ></div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {category.name}
              </h1>
            </div>
          </div>
          
          {category.description && (
            <p className="text-lg text-gray-600 mb-4">{category.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="h-4 w-4" />
            <span>
              {goals.length} total goal{goals.length !== 1 ? 's' : ''} in this category
            </span>
          </div>
        </div>

        {loading ? (
          <GoalsSkeleton />
        ) : goals.length === 0 ? (
          <div className="text-center py-16">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 max-w-md mx-auto">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals in this category</h3>
              <p className="text-gray-500 mb-6">
                There are no goals assigned to the &quot;{category.name}&quot; category yet.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Active Goals Section */}
            {activeGoals.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 pb-4">
                  Active Goals ({activeGoals.length})
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {activeGoals.map((goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onClick={() => setPreviewingGoal(goal)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Goals Section */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 pb-4">
                  Completed Goals ({completedGoals.length})
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {completedGoals.map((goal) => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onClick={() => setPreviewingGoal(goal)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}