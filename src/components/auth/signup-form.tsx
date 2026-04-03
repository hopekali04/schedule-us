"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import type { AuthFeedback } from "@/types/types";
import GoogleIcon from "./google-icon";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const provider = useMemo(() => new GoogleAuthProvider(), []);

  const createSession = async (idToken: string) => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create session");
    }
  };

  const resolveFirebaseError = (error: unknown, fallback: string) => {
    if (!error || typeof error !== "object" || !("code" in error)) {
      return fallback;
    }

    const code = String(error.code);
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in instead.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/popup-closed-by-user":
        return "Google sign up was cancelled before completion.";
      case "auth/popup-blocked":
        return "Popup was blocked. Please allow popups and try again.";
      default:
        return fallback;
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "Passwords do not match. Please re-enter both fields.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: resolveFirebaseError(
          error,
          "Unable to create your account right now.",
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setFeedback(null);
    setIsGoogleLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push("/");
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: resolveFirebaseError(
          error,
          "Google sign up failed. Please try again.",
        ),
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isBusy = isLoading || isGoogleLoading;

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isBusy}
            autoComplete="email"
            placeholder="m@example.com"
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isBusy}
            autoComplete="new-password"
            minLength={6}
            placeholder="At least 6 characters"
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isBusy}
            autoComplete="new-password"
            minLength={6}
            placeholder="Re-enter your password"
            className="pl-10"
          />
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <p>{feedback.message}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={isBusy}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-cyan-700 hover:text-cyan-800"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
