"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig";
import type { AuthFeedback } from "@/types/types";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({
        type: "success",
        message: "Reset link sent. Check your inbox and spam folder.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Unable to send reset email right now. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          disabled={isLoading}
          required
        />
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <p>{feedback.message}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? "Sending reset link..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remembered your password?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-cyan-700 hover:text-cyan-800"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
