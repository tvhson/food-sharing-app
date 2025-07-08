# Password Reset API Documentation

This document describes the password reset functionality implemented with React Query.

## API Endpoints

### 1. Forgot Password

- **Endpoint**: `GET /auth/forgot-password?email={email}`
- **Purpose**: Sends OTP to user's email for password reset
- **Parameters**:
  - `email` (string): User's email address

### 2. Verify OTP

- **Endpoint**: `GET /auth/verify-otp?email={email}&otp={otp}`
- **Purpose**: Verifies the OTP sent to user's email
- **Parameters**:
  - `email` (string): User's email address
  - `otp` (string): One-time password received via email

### 3. Reset Password

- **Endpoint**: `GET /auth/reset-password?email={email}&newPassword={newPassword}`
- **Purpose**: Resets user's password with new password
- **Parameters**:
  - `email` (string): User's email address
  - `newPassword` (string): New password for the account

## React Query Hooks

### useForgotPassword()

```typescript
import {useForgotPassword} from '../api/usePasswordReset';

const forgotPasswordMutation = useForgotPassword();

// Usage
const handleForgotPassword = async (email: string) => {
  const result = await forgotPasswordMutation.mutateAsync(email);
  // Handle result
};
```

### useVerifyOtp()

```typescript
import {useVerifyOtp} from '../api/usePasswordReset';

const verifyOtpMutation = useVerifyOtp();

// Usage
const handleVerifyOtp = async (email: string, otp: string) => {
  const result = await verifyOtpMutation.mutateAsync({email, otp});
  // Handle result
};
```

### useResetPassword()

```typescript
import {useResetPassword} from '../api/usePasswordReset';

const resetPasswordMutation = useResetPassword();

// Usage
const handleResetPassword = async (email: string, newPassword: string) => {
  const result = await resetPasswordMutation.mutateAsync({email, newPassword});
  // Handle result
};
```

## Example Component

See `ForgotPasswordForm.tsx` for a complete implementation example that demonstrates:

1. Multi-step form flow (Email → OTP → New Password)
2. Loading states with React Query
3. Error handling
4. Form validation
5. User feedback with alerts

## Features

- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Built-in loading states from React Query
- **Optimistic Updates**: Immediate UI feedback
- **Retry Logic**: Automatic retry on network failures
- **Cache Management**: Efficient caching and invalidation

## Usage Flow

1. User enters email → `useForgotPassword()`
2. User receives OTP via email
3. User enters OTP → `useVerifyOtp()`
4. OTP verified successfully
5. User enters new password → `useResetPassword()`
6. Password reset complete

## Error Handling

All hooks include error handling that:

- Logs errors to console for debugging
- Provides user-friendly error messages
- Handles network failures gracefully
- Validates input parameters
