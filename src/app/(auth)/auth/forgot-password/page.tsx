import AuthShell from "@/components/auth/auth-shell";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import type { AuthShellContent } from "@/types/types";

const forgotPasswordContent: AuthShellContent = {
  eyebrow: "Schedule Us",
  title: "Reset your password and get back to planning.",
  description:
    "Enter your account email and we will send a secure reset link so you can continue your goals without delay.",
  highlights: [
    {
      title: "Quick account recovery",
      description:
        "Password reset links are delivered directly to your inbox within moments.",
    },
    {
      title: "Secure by default",
      description:
        "Reset links are single-use and expire automatically for stronger protection.",
    },
    {
      title: "No progress lost",
      description:
        "Your goals, categories, and groups remain unchanged while you update access.",
    },
  ],
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell content={forgotPasswordContent}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">
          Reset password
        </h2>
        <p className="text-sm text-slate-600">
          We will email you a reset link for your account.
        </p>
      </div>

      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </AuthShell>
  );
}
