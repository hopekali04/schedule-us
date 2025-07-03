"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/categories/category-modal";
import { Categories } from "@/types/types";
import { getAllCategories, deleteCategory } from "@/lib/api";

export function CategoriesClient() {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
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
        </div>
    );
}
