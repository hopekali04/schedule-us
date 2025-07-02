// components/shared/color-picker.tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#16a34a", // Green
  "#2563eb", // Blue
  "#ca8a04", // Yellow
  "#dc2626", // Red
  "#9333ea", // Purple
  "#ea580c", // Orange
  "#db2777", // Pink
  "#71717a", // Gray
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
            value === color ? "border-primary" : "border-transparent"
          )}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        >
          {value === color && <Check className="h-5 w-5 text-white" />}
        </button>
      ))}
    </div>
  );
}