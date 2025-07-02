// components/groups/group-modal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGroup } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const groupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters long."),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupModal({ isOpen, onClose }: GroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  const handleClose = () => {
    reset(); // Reset form fields when the modal is closed
    onClose();
  };

  const onSubmit = async (data: GroupFormData) => {
    setIsLoading(true);
    try {
      await createGroup(data);
      toast({
        title: "Success!",
        description: `Group "${data.name}" has been created.`,
        variant: "default",
      });
      handleClose();
      router.refresh(); // Refresh page to update sidebar and other components
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create group.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Groups allow you to collaborate on shared goals with friends, family, or teammates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="name">Group Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Family Vacation Fund, Q3 Project Team" 
              {...register("name")} 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="What is this group for?" 
              {...register("description")} 
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}