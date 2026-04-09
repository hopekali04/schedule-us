// components/goals/goal-modal.tsx
"use client";

import { Key, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Categories, GoalWithProgress, Group } from "@/types/types";
import { createGoal, updateGoal } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ColorPicker from "../shared/color-picker";
import { PlusCircle, Trash2, Sparkles, X, Loader2 } from "lucide-react";
import { useAISuggestions, type AISuggestion } from "@/hooks/use-ai-suggestions";
// import { useRouter } from "next/navigation";

const goalSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  groupId: z.string({ required_error: "Please select a group." }),
  color: z.string().optional(),
  categoryId: z.string(),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  steps: z.array(z.object({ description: z.string().min(1, "Step description cannot be empty.") })),
});

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: GoalWithProgress | null;
  groups: Group[];
  categories: Categories[];
}

export default function GoalModal({ isOpen, onClose, goal, groups, categories }: GoalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading: aiLoading, error: aiError, fetchSuggestions, clearSuggestions } = useAISuggestions();
//   const router = useRouter();
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || "",
      description: goal?.description || "",
      groupId: goal?.groupId || "",
      color: goal?.color || "#2563eb",
      categoryId: goal?.categoryId || "",
      startAt: goal ? new Date(goal.startAt as Date).toISOString().split('T')[0] : "",
      endAt: goal ? new Date(goal.endAt as Date).toISOString().split('T')[0] : "",
      steps: goal?.steps?.length ? goal.steps.map(s => ({ description: s.description })) : [{ description: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "steps" });

  const handleGetAISuggestions = async () => {
    setShowSuggestions(true);
    await fetchSuggestions();
  };

  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    // Fill form fields with the selected suggestion
    setValue("name", suggestion.name);
    setValue("description", suggestion.description);
    
    // Replace all steps with the suggestion steps
    const formattedSteps = suggestion.steps.map(step => ({ description: step }));
    replace(formattedSteps);
    
    // Hide suggestions after selection
    setShowSuggestions(false);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    clearSuggestions();
  };

  const onSubmit = async (data: z.infer<typeof goalSchema>) => {
    setIsLoading(true);
    try {
      if (goal) {
        await updateGoal(goal.id, data);
      } else {
        await createGoal(data);
      }
      onClose(); // Parent will call router.refresh()
    } catch (error) {
      console.error(error); // Add user-facing error handling (e.g., a toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Goal Name</Label>
              {!goal && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetAISuggestions}
                  disabled={aiLoading}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  {aiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  AI Suggestions
                </Button>
              )}
            </div>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* AI Suggestions Display */}
          {showSuggestions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-blue-800">AI Goal Suggestions</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseSuggestions}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {aiError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {aiError}
                </div>
              )}
              
              {suggestions.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-white border border-blue-200 rounded-md p-3 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <h5 className="font-medium text-gray-900 text-sm">{suggestion.name}</h5>
                      <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {suggestion.steps.length} steps included
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {aiLoading && (
                <div className="flex items-center justify-center py-4 text-blue-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating suggestions...
                </div>
              )}
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1"><Label htmlFor="startAt">Start Date</Label><Input type="date" id="startAt" {...register("startAt")} />{errors.startAt && <p className="text-red-500 text-sm">{errors.startAt.message}</p>}</div>
             <div className="space-y-1"><Label htmlFor="endAt">End Date</Label><Input type="date" id="endAt" {...register("endAt")} />{errors.endAt && <p className="text-red-500 text-sm">{errors.endAt.message}</p>}</div>
          </div>
          <Controller name="color" control={control} render={({ field }) => (<div><Label>Color</Label><ColorPicker value={field.value!} onChange={field.onChange} /></div>)} />          
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="groupId"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Group</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name === "<self>" ? "Personal" : g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.groupId && (
                    <p className="text-red-500 text-sm">{errors.groupId.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Steps to achieve this goal</Label>
            {fields.map((field: { id: Key | null | undefined; }, index: number) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input {...register(`steps.${index}.description`)} placeholder={`Step ${index + 1}`} />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
            {errors.steps && <p className="text-red-500 text-sm">All step descriptions are required.</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Add Step</Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Goal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}