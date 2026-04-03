---
name: ui-ux
description:
  Detailed UI/UX component patterns, design templates, form architecture, hooks, and
  design system standards for the Schedule Us Next.js project. Load this skill when
  building or modifying any UI component, form, table, page layout, chart, or design
  system element. Also use when scaffolding new features from scratch.
---

# UI/UX Skill — Schedule Us Design System

This skill provides ready-to-adapt patterns. Always use these as your foundation.
Never start from scratch when a pattern here applies.

---

## Component Naming Convention

Every component name is semantic, domain-specific, and immediately understandable.

| ✅ Good | ❌ Never |
|---|---|
| `GoalStatusBadge` | `StatusBadge2` |
| `GoalCreateForm` | `FormNew` |
| `GoalCard` | `CardComponent` |
| `GroupMemberList` | `DataList3` |
| `FormSectionHeader` | `SectionWrapper` |
| `QuickAddFab` | `FloatingButton` |
| `GoalProgressBar` | `ProgressThing` |
| `CategoryColorDot` | `ColorCircle` |

---

## Types Reference — `/src/types/types.ts`

All types live in a **single file**. Add to it; do not create competing type files.
The existing file already contains the core domain types. Extend it with UI-specific
types as needed.

### Key Domain Types (already exist — reference, don't duplicate)

```typescript
// Goal status — the computed states driven by dates and step completion
export type GoalStatus = "on_track" | "at_risk" | "overdue" | "completed" | "closed";

// Core goal shape (simplified — see types.ts for full definition)
export interface Goal {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  groupId?: string;
  startDate: string;        // ISO 8601
  endDate: string;          // ISO 8601
  status: GoalStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface GoalStep {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface GoalWithProgress extends Goal {
  progress: GoalProgressData;
  steps: GoalStep[];
}

export interface GoalProgressData {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  daysRemaining: number;
  status: GoalStatus;
}
```

### UI Types to Add When Needed

```typescript
// /src/types/types.ts — add these in the "UI" section

export interface GoalStatusBadgeConfig {
  label: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface QuickAddOption {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}
```

---

## Status Configuration — System-Wide, Never Deviate

```typescript
// /src/lib/goal-status-config.ts
import type { GoalStatus, GoalStatusBadgeConfig } from "@/types/types";

export const GOAL_STATUS_CONFIG: Record<GoalStatus, GoalStatusBadgeConfig> = {
  on_track: {
    label: "On Track",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    dotClass: "bg-green-500",
  },
  at_risk: {
    label: "At Risk",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    dotClass: "bg-yellow-500",
  },
  overdue: {
    label: "Overdue",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    dotClass: "bg-red-500",
  },
  completed: {
    label: "Completed",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
    dotClass: "bg-blue-500",
  },
  closed: {
    label: "Closed",
    bgClass: "bg-slate-100",
    textClass: "text-slate-600",
    dotClass: "bg-slate-400",
  },
};
```

---

## Core Patterns

### 1. QuickAddFab — Primary Action Trigger

Single FAB, always fixed at `bottom-6 right-6`, expands to two quick-add options.

```tsx
// components/ui/QuickAddFab.tsx
"use client";

import { useState } from "react";
import { Plus, Target, Users } from "lucide-react";

interface QuickAddOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickAddFabProps {
  onNewGoal: () => void;
  onNewGroup: () => void;
}

export function QuickAddFab({ onNewGoal, onNewGroup }: QuickAddFabProps) {
  const [open, setOpen] = useState(false);

  const options: QuickAddOption[] = [
    {
      id: "new-goal",
      label: "New Goal",
      icon: <Target className="h-5 w-5" />,
      onClick: () => { setOpen(false); onNewGoal(); },
    },
    {
      id: "new-group",
      label: "New Group",
      icon: <Users className="h-5 w-5" />,
      onClick: () => { setOpen(false); onNewGroup(); },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2">
          {options.map((option) => (
            <QuickAddOptionButton key={option.id} option={option} />
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Quick add"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-all hover:bg-blue-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <Plus
          className={`h-6 w-6 text-white transition-transform duration-200 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
}

function QuickAddOptionButton({ option }: { option: QuickAddOption }) {
  return (
    <button
      onClick={option.onClick}
      className="flex min-h-[44px] items-center gap-3 rounded-full bg-white px-4 py-2 shadow-md transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="text-slate-600">{option.icon}</span>
      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        {option.label}
      </span>
    </button>
  );
}
```

---

### 2. useFormDraft Hook — Session Auto-Save

```typescript
// src/hooks/useFormDraft.ts
import { useEffect } from "react";
import type { UseFormReturn, FieldValues, DefaultValues } from "react-hook-form";

interface UseFormDraftOptions<T extends FieldValues> {
  key: string;
  form: UseFormReturn<T>;
  defaultValues: DefaultValues<T>;
}

interface UseFormDraftReturn {
  clearDraft: () => void;
  hasDraft: boolean;
}

export function useFormDraft<T extends FieldValues>({
  key,
  form,
  defaultValues,
}: UseFormDraftOptions<T>): UseFormDraftReturn {
  const storageKey = `draft:${key}`;
  const { watch, reset } = form;

  const hasDraft =
    typeof window !== "undefined"
      ? sessionStorage.getItem(storageKey) !== null
      : false;

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        reset(parsed);
      }
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey, reset]);

  // Save on every change
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // sessionStorage may be unavailable in some contexts
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(storageKey);
      reset(defaultValues);
    } catch {
      // ignore
    }
  };

  return { clearDraft, hasDraft };
}
```

---

### 3. Form Section Layout — Icon-Led Structure

```tsx
// src/components/ui/FormSection.tsx
import type { ReactNode } from "react";

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  icon,
  title,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={`space-y-4 ${className ?? ""}`}>
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className="text-blue-600" aria-hidden="true">
          {icon}
        </span>
        <h2 className="text-base font-medium text-slate-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
```

**Usage in a Goal form:**
```tsx
<FormSection
  icon={<CalendarIcon className="h-5 w-5" />}
  title="Schedule"
>
  {/* Required fields */}
  <DateField name="startDate" label="Start Date" required />
  <DateField name="endDate" label="End Date" required />

  {/* Optional fields — clearly separated */}
  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
    Optional
  </p>
  <TextField
    name="description"
    label="Description"
    hint="What does completing this goal look like?"
  />
</FormSection>
```

---

### 4. GoalStatusBadge — System-Wide Status Component

```tsx
// src/components/ui/GoalStatusBadge.tsx
import { GOAL_STATUS_CONFIG } from "@/lib/goal-status-config";
import type { GoalStatus } from "@/types/types";

interface GoalStatusBadgeProps {
  status: GoalStatus;
}

export function GoalStatusBadge({ status }: GoalStatusBadgeProps) {
  const config = GOAL_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
```

---

### 5. LoadingButton — Required for All Mutations

```tsx
// src/components/ui/LoadingButton.tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function LoadingButton({
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      aria-busy={loading}
      className={`
        inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg
        bg-blue-600 px-6 py-2.5 text-sm font-medium text-white
        transition-all hover:bg-blue-700 active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
```

---

### 6. GoalProgressBar — Progress with Label

Always show the percentage as a readable label alongside the bar.
Never a bar alone. Uses Shadcn `Progress`.

```tsx
// src/components/ui/GoalProgressBar.tsx
import { Progress } from "@/components/ui/progress";

interface GoalProgressBarProps {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  showStepCount?: boolean;
}

export function GoalProgressBar({
  percentage,
  completedSteps,
  totalSteps,
  showStepCount = true,
}: GoalProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {showStepCount && (
          <span className="text-xs text-slate-500">
            {completedSteps} of {totalSteps} steps
          </span>
        )}
        <span className="text-xs font-medium text-slate-700 ml-auto">
          {clamped}%
        </span>
      </div>
      <Progress
        value={clamped}
        aria-label={`${clamped}% complete`}
        className="h-2"
      />
    </div>
  );
}
```

---

### 7. GoalCard — Standard Goal Display

```tsx
// src/components/goals/GoalCard.tsx
import { CalendarIcon } from "lucide-react";
import { GoalStatusBadge } from "@/components/ui/GoalStatusBadge";
import { GoalProgressBar } from "@/components/ui/GoalProgressBar";
import type { GoalWithProgress } from "@/types/types";

interface GoalCardProps {
  goal: GoalWithProgress;
  onEdit?: (goal: GoalWithProgress) => void;
  categoryColor?: string;
}

export function GoalCard({ goal, onEdit, categoryColor }: GoalCardProps) {
  const { progress } = goal;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {categoryColor && (
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: categoryColor }}
              aria-hidden="true"
            />
          )}
          <h3 className="text-base font-medium text-slate-900 leading-snug">
            {goal.title}
          </h3>
        </div>
        <GoalStatusBadge status={progress.status} />
      </div>

      {goal.description && (
        <p className="mb-3 text-sm text-slate-500 line-clamp-2">
          {goal.description}
        </p>
      )}

      <GoalProgressBar
        percentage={progress.percentage}
        completedSteps={progress.completedSteps}
        totalSteps={progress.totalSteps}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {progress.daysRemaining > 0
              ? `${progress.daysRemaining} days remaining`
              : progress.status === "completed"
              ? "Completed"
              : "Past due"}
          </span>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(goal)}
            className="text-xs font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </article>
  );
}
```

---

### 8. EmptyState — Required on All List Pages

```tsx
// src/components/ui/EmptyState.tsx
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-slate-300">{icon}</div>
      <h3 className="mb-1 text-base font-medium text-slate-800">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}
```

**Domain-specific empty states:**
```tsx
// Goals list
<EmptyState
  icon={<Target className="h-12 w-12" />}
  title="No goals yet"
  description="Create your first goal and start tracking your progress."
  action={<Button onClick={onNewGoal}>Create a Goal</Button>}
/>

// Group members
<EmptyState
  icon={<Users className="h-12 w-12" />}
  title="No members yet"
  description="Invite teammates to collaborate on goals together."
  action={<Button onClick={onInvite}>Invite Someone</Button>}
/>

// Chat room
<EmptyState
  icon={<MessageCircle className="h-12 w-12" />}
  title="No messages yet"
  description="Send the first message to start the conversation."
/>
```

---

### 9. Skeleton Screens — Use Instead of Spinners

```tsx
// src/components/ui/skeletons/GoalCardSkeleton.tsx
export function GoalCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-5 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-4/5 rounded bg-slate-100" />
      <div className="h-2 w-full rounded-full bg-slate-100 mt-2" />
      <div className="flex justify-between pt-1">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-3 w-8 rounded bg-slate-100" />
      </div>
    </div>
  );
}

// src/components/ui/skeletons/TableSkeleton.tsx
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 w-full animate-pulse rounded-lg bg-slate-100"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// src/components/ui/skeletons/DashboardStatSkeleton.tsx
export function DashboardStatSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-3 w-1/2 rounded bg-slate-100 mb-3" />
      <div className="h-8 w-1/3 rounded bg-slate-100" />
    </div>
  );
}
```

---

### 10. API Route Pattern — Consistent Structure

All API routes follow this structure. No ad-hoc patterns.

```typescript
// src/app/api/goals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuth } from "@/lib/auth-helper";

const CreateGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  groupId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // 1. Verify auth
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate body
  const body = await request.json();
  const parsed = CreateGoalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 3. Business logic
  try {
    const goalRef = adminDb.collection("goals").doc();
    const now = new Date().toISOString();
    await goalRef.set({
      ...parsed.data,
      id: goalRef.id,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return NextResponse.json({ id: goalRef.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create goal. Please try again." },
      { status: 500 }
    );
  }
}
```

---

### 11. Zod Schema Pattern — Form Schemas

```typescript
// src/lib/schemas/goal.schema.ts
import { z } from "zod";

export const GoalFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Please enter a goal title")
      .max(200, "Title must be under 200 characters"),
    description: z.string().max(1000).optional(),
    categoryId: z.string().min(1, "Please select a category"),
    startDate: z.string().min(1, "Please set a start date"),
    endDate: z.string().min(1, "Please set an end date"),
    groupId: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type GoalFormValues = z.infer<typeof GoalFormSchema>;
```

---

### 12. Error Message Standard

Every error message explains what to do. Never just what went wrong.

| ❌ Never | ✅ Always |
|---|---|
| `"Error 400"` | `"Please select a valid category."` |
| `"Required"` | `"Please enter a goal title to continue."` |
| `"Network error"` | `"Can't connect. Check your connection and tap Retry."` |
| `"Unauthorized"` | `"Your session expired. Please sign in again."` |
| `"Invalid value"` | `"End date must be after the start date."` |
| `"Something went wrong"` | `"Failed to save your goal. Please try again."` |

---

### 13. Toast Standards

Every API mutation triggers a toast. No silent actions.

```typescript
// Pattern for every mutation
try {
  await api.goals.create(data);
  toast.success("Goal created successfully");   // auto-dismiss: 4000ms
  clearDraft();
  router.push("/goals");
} catch {
  toast.error("Failed to create goal. Please try again.", {
    action: { label: "Retry", onClick: handleSubmit },
  });
}
```

Toast timing standards:
- **Success:** auto-dismiss after **4 seconds**
- **Error:** persistent until user dismisses, with retry action where applicable
- **Info** (draft saved, etc.): auto-dismiss after **3 seconds**

---

### 14. Responsive List Pattern

```tsx
// Desktop: full table — Mobile: card list. No horizontal scroll. Ever.
<div>
  {/* Desktop table */}
  <div className="hidden md:block">
    <table>...</table>
  </div>

  {/* Mobile card list */}
  <div className="space-y-3 md:hidden">
    {goals.map((goal) => (
      <GoalCard key={goal.id} goal={goal} />
    ))}
  </div>

  {/* Shared pagination — always present if list can exceed 20 records */}
  <PaginationControls
    page={page}
    pageSize={25}
    totalCount={totalCount}
    onPageChange={setPage}
  />
</div>
```

---

### 15. Recharts Pattern — Dashboard Charts

```tsx
// Always use ResponsiveContainer. Always include a tooltip and legend.
// Always show a text summary alongside the chart.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GoalCompletionChartProps {
  data: { name: string; completed: number; total: number }[];
  completedTotal: number;
  grandTotal: number;
}

export function GoalCompletionChart({
  data,
  completedTotal,
  grandTotal,
}: GoalCompletionChartProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-600">
        <span className="text-lg font-semibold text-slate-900">
          {completedTotal}
        </span>{" "}
        of {grandTotal} goals completed
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="total" name="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## Design Tokens Reference

Use these consistently. Never introduce one-off values.

### Spacing Scale (4px base)
`gap-1 (4px)` · `gap-2 (8px)` · `gap-3 (12px)` · `gap-4 (16px)` · `gap-6 (24px)` · `gap-8 (32px)`

### Touch Target Minimum
All interactive elements: `min-h-[44px]` + adequate horizontal padding (`px-4` minimum)

### Border Radius
- Cards: `rounded-xl`
- Inputs: `rounded-lg`
- Badges: `rounded-full`
- Buttons: `rounded-lg`

### Shadow Scale
- Cards: `shadow-sm`
- Modals/Drawers: `shadow-xl`
- FAB: `shadow-lg`
- Dropdowns: `shadow-md`

### Focus State (all interactive elements)
`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`

### Muted Text
Use `text-slate-500` for secondary text and `text-muted-foreground` for Shadcn-aware contexts.