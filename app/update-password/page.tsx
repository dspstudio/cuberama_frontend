'use client';

import { useState } from 'react';
import UpdatePasswordForm from '../components/UpdatePasswordForm';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabaseClient';

export default function UpdatePasswordPage() {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setEmailSent(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password/`,
    });

    setSending(false);
    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid or Expired Session</h1>
        <p className="mb-6">Your password reset link may have expired, or the session is invalid. Please request a new password reset email.</p>
        
        <form onSubmit={handleResetPassword} className="max-w-md mx-auto bg-[#161A25] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Request New Reset Email</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#0A0E1A] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors text-sm h-10 mb-4"
            required
          />
          <button 
            type="submit"
            className="w-full px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Reset Email'}
          </button>
          {emailSent && <p className="text-green-400 mt-4">A new password reset email has been sent. Please check your inbox.</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Update Your Password</h1>
      <UpdatePasswordForm />
    </div>
  );
}