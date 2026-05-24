# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** — breaking changes
- **MINOR** — new features (backwards compatible)
- **PATCH** — bug fixes (backwards compatible)

---

## [Unreleased]

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
