# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** — breaking changes
- **MINOR** — new features (backwards compatible)
- **PATCH** — bug fixes (backwards compatible)

---

## [Unreleased]

---

## Frontend [0.4.1] — 2026-05-26

### Changed
- Unverified users who click Like or Reply now see a sonner warning toast
  ("Please verify your email address...") instead of silently disabled buttons
- `CommentInput` shows a clear inline message for unverified users instead of
  rendering the input at all
- Register success toast updated to instruct user to check email for verification

---

## Frontend [0.4.0] — 2026-05-26

### Added
- Email verification flow on registration
  - `/verify-email` page that auto-submits token on load with fallback manual button
  - Clear error states for missing or expired tokens with link to re-register
  - Success confirmation with redirect to `/login`
  - `useVerifyEmailViewModel` with toast handling
  - `verifyEmail` server action and `VerifyEmailActionState` in `actions.ts`
  - All states responsive on mobile and desktop, light and dark mode
- Removed `welcomeNewUser` call from `useRegisterViewModel` — backend now handles both emails

### Other
- `JCA.png` set as browser favicon in `layout.tsx`

---

## Frontend [0.3.0] — 2026-05-24

### Added
- Full forgot/reset password flow
  - `/forgot-password` page with email input and success confirmation state
  - `/reset-password` page with token validation, password requirements hint, and confirm password field
  - "Forgot password?" link added to login form next to the password label
  - `useForgotPasswordViewModel` and `useResetPasswordViewModel`
  - `forgotPassword` and `resetPassword` server actions in `actions.ts`
  - Server-side confirm password match validation via Zod `.refine()`
  - All pages responsive on mobile and desktop, light and dark mode

---

## Frontend [0.2.0] — 2026-05-24

### Added
- Skeleton loading state for full-size image viewer
  - Pulsing `animate-pulse` placeholder shown while original image fetches from server
  - Image rendered off-screen during load so `onLoad` fires reliably
  - Smooth opacity transition when image becomes ready
  - `key={selectedIndex}` on `<Image>` ensures `onLoad` fires on every navigation

---

## Frontend [0.1.1] — 2026-05-24

### Fixed
- Sonner toast notifications not displaying on repeated login failures
  - `useEffect` in `useLoginViewModel` and `useRegisterViewModel` now depends on full `state` object instead of `state.status`, so toasts fire on every submission even when status string hasn't changed
- Login toast never displaying for invalid credentials
  - Auth.js `CredentialsSignin` error was falling through to `idle` status due to incorrect error shape assumptions; now returns `failed` as the default for all non-Zod errors
- Login toast incorrectly showing "Please enter valid inputs!" for bad email format or short password
  - All Zod validation failures on the login form now return `failed` status — users see "Invalid credentials!" regardless of input format issues
- Noisy `CredentialsSignin` console logs on expected bad login attempts suppressed
- Register validation error messages rewritten to be user-friendly
  - Removed raw Zod output like `"String must contain at least 6 character(s)"`
  - Removed field path prefix and hyphen from toast output (e.g. `"Username - ..."`)

---

## Backend [1.2.1] — 2026-05-26

### Changed
- `createNewUserController` now only sends the verification email on registration;
  welcome email moved to fire after successful email verification
- `verifyEmailController` now sends the welcome email upon successful verification
- Added `requireVerifiedUser` middleware that checks `isVerified` on the user record
- Applied `verifyToken + requireVerifiedUser` to `POST /comments` and `POST /comments/like`
  routes — unverified users receive a 403 with a clear message

---

## Backend [1.2.0] — 2026-05-26

### Added
- Email verification flow
  - `verificationToken` and `verificationTokenExpiry` fields added to `User` model in Prisma schema
  - `createVerificationToken` — generates a secure 32-byte hex token, expires in 48 hours
  - `verifyAccountToken` — validates token, sets `isVerified: true`, clears token fields
  - `findUserByVerificationToken` — looks up user by valid non-expired verification token
  - `deleteExpiredUnverifiedUsers` — deletes unverified accounts with expired tokens
  - `verificationEmail` — sends branded verification email via Resend with warm tone and clear 48h expiry warning
  - `POST /users/verify-email` route and `verifyEmailController`
  - Hourly cleanup job via `setInterval` that deletes expired unverified accounts; also runs immediately on server start
  - `createNewUserController` now generates verification token and fires both verification and welcome emails concurrently on registration

---

## Backend [1.1.0] — 2026-05-24

### Added
- Password reset flow
  - `resetToken` and `resetTokenExpiry` fields added to `User` model in Prisma schema
  - `createPasswordResetToken` — generates a secure 32-byte hex token, expires in 1 hour
  - `consumePasswordResetToken` — validates token, hashes and saves new password, clears token fields
  - `findUserByResetToken` — looks up user by valid non-expired token
  - `passwordResetEmail` — sends branded reset email via Resend using verified domain
  - `POST /users/forgot-password` — always returns 200 to prevent user enumeration
  - `POST /users/reset-password` — returns 400 for invalid/expired tokens
  - `FRONTEND_URL` added to `.env.development` and `.env.production`
- Welcome email `from` address updated to verified domain `noreply@blog.adkins.ninja`
- Contact admin email `from` address updated to verified domain `noreply@blog.adkins.ninja`
- Contact page URL placeholder replaced with `https://blog.adkins.ninja/contact` in welcome email
- Social media PS line commented out in welcome email template for future use
- `force-dynamic` export added to `/admin` page to fix Vercel static rendering error

---

## Backend [1.0.0] — Initial Release

### Added
- Express REST API with PostgreSQL via Prisma
- User authentication, sessions, and profile management
- Blog post CRUD
- Comments system with likes, replies, and notifications
- Admin dashboard stats endpoints
- Resend email integration
- Immich media server integration
- GeoIP session tracking
