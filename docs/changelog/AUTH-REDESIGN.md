# Changelog: Authentication Redesign & Improvements

**Date:** April 3, 2026  
**Branch:** `chore--AUTH`  
**PR:** [#25 — Add authentication components and improve UI structure](https://github.com/hopekali04/schedule-us/pull/25)

---

## Features Added

### Authentication UI Redesign

- **New Auth Shell Component** — Lively, gradient-based auth layout with feature highlights
  - Glassmorphic left panel with cyan/emerald blur effects
  - Feature highlights with icons and descriptions
  - Responsive grid layout (single column mobile, two-column desktop)

- **Enhanced Sign-In Form**
  - Email/password authentication
  - Google OAuth sign-in via Firebase popup
  - Inline password reset action
  - Link to dedicated reset password page
  - Typed error/success/info feedback messages

- **Enhanced Sign-Up Form**
  - Email/password sign-up with confirmation field
  - Password validation (minimum 6 characters)
  - Confirm password validation with helpful error messages
  - Google OAuth sign-up integration
  - Typed feedback system with error, success, and info states

- **Dedicated Reset Password Page**
  - Standalone forgot-password flow at `/auth/forgot-password`
  - Secure Firebase email reset link handling
  - Feature highlights specific to password recovery

### Component Improvements

- **Form Field Icons** — Added visual clarity to all form inputs
  - Mail icon for email fields
  - Lock icon for password fields
  - Properly positioned, accessible, and responsive

- **Google Authentication**
  - Integrated Google Sign-In/Sign-Up using Firebase `signInWithPopup`
  - Proper error handling for popup-blocked and user-cancelled flows
  - Session creation matches email/password flow

### Toast System Implementation

- **Dark Theme Design**
  - Background: Slate-900 with border-slate-700
  - Colored left segment (12px wide) with relevant icon
  - Inline message in slate-100 text
  - Smooth auto-dismiss with duration: success/info (3.5–4s), error (7s)

- **Integration Pattern**
  - All auth forms now use centralized `authToast` utility
  - No inline feedback panels; unified toast experience across signin/signup/reset
  - Toast mounted globally in auth layout via `<Toaster />` component
  - Consistent feedback UX: "Account created!", "Invalid password", "Sending reset link...", etc.

### Types & Configuration

- **New Auth Types** (in `/src/types/types.ts`)
  - `AuthFeedback` — Message type with severity level
  - `AuthShellContent` — Page content structure (eyebrow, title, description, highlights)
  - `AuthShellHighlight` — Feature highlight (title + description)
  - `AuthScreenVariant` — Discriminated union for auth screen types

- **Google Icon Component** — Custom SVG component for Google branding on auth buttons

---

## Bug Fixes

- **Recharts Tooltip Type Error** (in `src/components/dashboard/charts-grid.tsx`)
  - Fixed `Tooltip` `formatter` prop signature to accept broader `ValueType` union
  - Prevents build failure when `value` could be `undefined`
  - Maintains percentage formatting on pie chart tooltips

- **Toast Title Type Collision** (in `src/components/ui/use-toast.ts`)
  - Fixed `ToasterToast` type definition by using `Omit<ToastProps, "title">` before redefining `title`
  - Radix native `title: string` was conflicting with custom `title: React.ReactNode`
  - Enables JSX content (icons, formatted messages) to be safely passed as toast title
  - Result: Universal dark toast with rich UI structure is now fully type-safe

---

## Files Modified/Created

### New Files

- `src/components/auth/auth-shell.tsx` — Shared auth layout component
- `src/components/auth/google-icon.tsx` — Google logo SVG icon
- `src/components/auth/forgot-password-form.tsx` — Password reset form
- `src/app/(auth)/auth/forgot-password/page.tsx` — Reset password page
- `src/lib/auth-toast.tsx` — Universal auth toast utility with dark theme design

### Updated Files

- `src/components/auth/signin-form.tsx` — Redesigned with icons, Google auth, reset action, integrated `authToast` feedback
- `src/components/auth/signup-form.tsx` — Redesigned with icons, Google auth, confirm password, integrated `authToast` feedback
- `src/app/(auth)/auth/signin/page.tsx` — Integrated auth shell, updated copy
- `src/app/(auth)/auth/signup/page.tsx` — Integrated auth shell, updated copy
- `src/app/(auth)/layout.tsx` — Added Toaster component to enable toast rendering across all auth pages
- `src/types/types.ts` — Added auth-specific type definitions
- `src/components/dashboard/charts-grid.tsx` — Fixed Recharts formatter type
- `src/components/ui/use-toast.ts` — Fixed `ToasterToast` type definition to support JSX content as toast title

---

## Quality Assurance

✅ **Linting** — All files pass ESLint  
✅ **Type Checking** — TypeScript strict mode validated  
✅ **Formatting** — Prettier applied to all modified/created files  

---

## Notes

- Firebase Admin SDK initialization still requires valid environment variables at build time.
- Google OAuth requires proper Firebase configuration in console (authorized domains, API keys).
- Password reset emails depend on Firebase transactional email integration.
