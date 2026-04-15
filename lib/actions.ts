'use server';

import { signIn } from '@/auth';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    // Handle authentication errors
    if (error && typeof error === 'object' && 'type' in error) {
      const authError = error as { type: string };
      switch (authError.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    // If it's a redirect error (successful auth), rethrow
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    return 'Something went wrong.';
  }
}

export async function sendEmergencyMagicLink(email: string) {
  try {
    // 1. Strict Security Enforcement
    if (email !== 'mr.jwswain@gmail.com') {
      throw new Error('Unauthorized: This emergency button is restricted.');
    }

    // 2. Trigger Magic Link
    await signIn('nodemailer', { email, redirect: false });

    return {
      success: true,
      message: 'Emergency link sent to secure admin email.',
    };
  } catch (error: unknown) {
    // Handle authentication errors
    if (error && typeof error === 'object' && 'type' in error) {
      return { error: 'Failed to send link.' };
    }
    throw error;
  }
}

