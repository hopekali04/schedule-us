"use client";

import { Check, Info, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type AuthToastVariant = "success" | "error" | "info";

const STATUS_STYLES: Record<
  AuthToastVariant,
  { segmentClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  success: {
    segmentClass: "bg-emerald-600",
    icon: Check,
  },
  error: {
    segmentClass: "bg-red-600",
    icon: X,
  },
  info: {
    segmentClass: "bg-sky-600",
    icon: Info,
  },
};

function showAuthToast(
  message: string,
  variant: AuthToastVariant,
  duration = 4000,
) {
  const { icon: Icon, segmentClass } = STATUS_STYLES[variant];

  toast({
    duration,
    className:
      "overflow-hidden rounded-md border border-slate-700 bg-slate-900 p-0 text-slate-100 shadow-xl",
    title: (
      <div className="flex items-stretch">
        <div
          className={`flex h-12 w-12 items-center justify-center ${segmentClass}`}
        >
          <Icon className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div className="flex items-center px-4 text-sm font-medium text-slate-100">
          {message}
        </div>
      </div>
    ),
  });
}

export const authToast = {
  success: (message: string) => showAuthToast(message, "success", 4000),
  error: (message: string) => showAuthToast(message, "error", 7000),
  info: (message: string) => showAuthToast(message, "info", 3500),
};
