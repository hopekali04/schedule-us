"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/categories/category-modal";
import { Categories } from "@/types/types";
import { getAllCategories, deleteCategory } from "@/lib/api";

function CategoriesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex items-center mt-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                        <div className="ml-2 h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CategoriesClient() {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const categories = await getAllCategories();
            setCategories(categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: Categories) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleSuccess = () => {
        fetchCategories();
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
            </div>
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSuccess={handleSuccess}
                category={selectedCategory}
            />
            {loading ? (
                <CategoriesSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold">{category.name}</h2>
                            <p>{category.description}</p>
                            <div className="flex items-center mt-2">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }}></div>
                                <span className="ml-2 text-sm text-gray-500">{category.color}</span>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}