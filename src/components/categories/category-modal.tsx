"use client";

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Categories } from "@/types/types";
import { createCategory, updateCategory } from "@/lib/api";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: Categories | null;
}

export function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            reset(category);
        } else {
            reset({ name: '', description: '', color: '' });
        }
    }, [category, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            if (category) {
                await updateCategory(category.id, data);
            } else {
                await createCategory(data);
            }
            onSuccess();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else if (typeof error === 'string') {
                setErrorMessage(error);
            } else {
                setErrorMessage('An error occurred while saving the category.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")}/>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description")}/>
                    </div>
                    <div>
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" type="color" {...register("color")}/>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : category
                                    ? "Save Changes"
                                    : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
