'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loginStatus, setLoginStatus] = useState<'idle' | 'checking' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const sessionId = searchParams?.get('id') || null;

  useEffect(() => {
    const handleAutoLogin = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;

      // If user is already logged in, no action needed
      if (user) {
        setLoginStatus('idle');
        return;
      }

      // If no session ID, can't proceed
      if (!sessionId) {
        setErrorMessage('Invalid payment session. Please contact support.');
        setLoginStatus('error');
        return;
      }

      setLoginStatus('checking');

      try {
        // Validate order and get magic link
        const response = await fetch(`/api/validate-order?sessionId=${encodeURIComponent(sessionId)}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to validate order');
        }

        const { magicLink: link, email } = await response.json();

        if (!link) {
          throw new Error('Failed to generate login link. Please try logging in manually.');
        }

        setMagicLink(link);
        setLoginStatus('ready');
      } catch (error: any) {
        console.error('Auto-login error:', error);
        setErrorMessage(error.message || 'Failed to generate login link. Please try logging in manually.');
        setLoginStatus('error');
      }
    };

    handleAutoLogin();
  }, [user, authLoading, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-green-500">Payment Successful!</h1>
        <p className="mt-4 text-lg text-center text-gray-700 dark:text-gray-300">
          Thank you for your purchase. Your order has been processed successfully.
        </p>

        {/* Auto-login status messages */}
        {!user && !authLoading && (
          <div className="mt-6">
            {loginStatus === 'checking' && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Validating your order...
              </p>
            )}
            {loginStatus === 'ready' && magicLink && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-center text-blue-700 dark:text-blue-300 mb-3">
                  Click the link below to automatically log in to your account:
                </p>
                <a
                  href={magicLink}
                  className="block w-full px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-md hover:opacity-90 transition-opacity duration-300"
                >
                  Log In to Your Account
                </a>
              </div>
            )}
            {loginStatus === 'error' && errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="text-sm text-center text-red-700 dark:text-red-300">
                  {errorMessage}
                </p>
                <Link 
                  href="/" 
                  className="block mt-2 text-sm text-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Go to homepage to log in manually
                </Link>
              </div>
            )}
          </div>
        )}

        {user && (
          <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">
            You're logged in and ready to use your Pro features!
          </p>
        )}

      </div>
    </div>
  );
}
