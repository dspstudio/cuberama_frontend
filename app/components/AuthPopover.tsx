import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import PasswordStrengthIndicator, { isPasswordStrong } from './PasswordStrengthIndicator';
import { GoogleIcon } from './Icons';
import { GithubIcon, FacebookIcon, XIcon, DiscordIcon, SlackIcon, AppleIcon, LinkedinIcon } from './ProviderIcons';
import { Provider } from '@supabase/supabase-js';

type AuthView = 'login' | 'register' | 'forgotPassword';

const oauthProviders = [
    { name: 'google', icon: GoogleIcon, label: 'Google' },
    { name: 'github', icon: GithubIcon, label: 'GitHub' },
    { name: 'facebook', icon: FacebookIcon, label: 'Facebook' },
    { name: 'twitter', icon: XIcon, label: 'X' },
    { name: 'discord', icon: DiscordIcon, label: 'Discord' },
    { name: 'slack', icon: SlackIcon, label: 'Slack' },
    { name: 'apple', icon: AppleIcon, label: 'Apple' },
    { name: 'linkedin', icon: LinkedinIcon, label: 'LinkedIn' },
];

const AuthPopover: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [wasPasswordFocused, setWasPasswordFocused] = useState(false);

    const inputClasses = "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-colors";
    const buttonClasses = "w-full px-5 py-2 mt-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    
    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else if (view === 'register') {
                if (!isPasswordStrong(password)) {
                  setError("Password does not meet the strength requirements.");
                  setLoading(false);
                  return;
                }
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Check your email for a confirmation link!');
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: process.env.NODE_ENV === 'production' ? 'https://cuberama.app/update-password/' : 'http://lm.com:3001/update-password/',
            });
            if (error) throw error;
            setMessage('Password reset email sent. Please check your inbox.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleOAuthSignIn = async (provider: Provider) => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleViewChange = (newView: AuthView) => {
        setView(newView);
        setEmail('');
        setPassword('');
        setError(null);
        setMessage(null);
        setWasPasswordFocused(false);
    }

    const renderLoginForm = () => (
        <form onSubmit={handleAuthAction} aria-labelledby="login-tab">
            <div className="space-y-4">
                <div>
                    <label htmlFor="login-email" className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" id="login-email" className={inputClasses} required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="login-password" className="block text-xs font-medium text-gray-400">Password</label>
                        <button type="button" onClick={() => handleViewChange('forgotPassword')} className="text-xs text-cyan-400 hover:underline focus:outline-none">
                            Forgot Password?
                        </button>
                    </div>
                    <input type="password" id="login-password" className={inputClasses} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );

    const renderRegisterForm = () => (
         <form onSubmit={handleAuthAction} aria-labelledby="register-tab">
            <div className="space-y-4">
                <div>
                    <label htmlFor="register-email" className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" id="register-email" className={inputClasses} required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                    <label htmlFor="register-password" className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                    <input 
                      type="password" 
                      id="register-password" 
                      className={inputClasses} 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      onFocus={() => setWasPasswordFocused(true)}
                      placeholder="••••••••" 
                    />
                </div>
                {wasPasswordFocused && (
                  <PasswordStrengthIndicator password={password} />
                )}
            </div>
            <button type="submit" className={buttonClasses} disabled={loading || !isPasswordStrong(password)}>
                {loading ? 'Creating...' : 'Create Account'}
            </button>
        </form>
    );

    const renderForgotPasswordForm = () => (
        <form onSubmit={handlePasswordReset}>
             <h3 className="text-center font-semibold text-white mb-2">Reset Your Password</h3>
             <p className="text-center text-xs text-gray-400 mb-4">Enter your email and we&apos;ll send you a link to get back into your account.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="reset-email" className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" id="reset-email" className={inputClasses} required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
    );

    return (
        <div 
            className="w-80 bg-slate-900 border border-white/10 rounded-lg shadow-2xl p-4 z-50 transform transition-all origin-top-right"
            onClick={(e) => e.stopPropagation()}
        >
            {view !== 'forgotPassword' && (
                <div className="flex border-b border-slate-700 mb-4">
                    <button
                        onClick={() => handleViewChange('login')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${view === 'login' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleViewChange('register')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${view === 'register' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>
            )}

            {view === 'login' && renderLoginForm()}
            {view === 'register' && renderRegisterForm()}
            {view === 'forgotPassword' && renderForgotPasswordForm()}

            {error && <p className="text-xs text-red-400 mt-3 text-center">{error}</p>}
            {message && <p className="text-xs text-green-400 mt-3 text-center">{message}</p>}

            {view !== 'forgotPassword' && (
                <>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-slate-900 px-2 text-gray-500 uppercase">Or continue with</span>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        {oauthProviders.map((provider) => (
                            <button
                                key={provider.name}
                                type="button"
                                onClick={() => handleOAuthSignIn(provider.name as Provider)}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors text-white text-sm font-medium disabled:opacity-50 cursor-pointer"
                            >
                                <provider.icon className="w-5 h-5" />
                                <span>{provider.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
            
            <p className="text-xs text-center text-gray-500 mt-4">
                {view === 'login' ? "No account?" : view === 'register' ? "Already have an account?" : ""}{' '}
                <button type="button" onClick={() => handleViewChange(view === 'login' ? 'register' : 'login')} className="font-semibold text-cyan-400 hover:underline focus:outline-none">
                    {view === 'login' ? "Create one" : view === 'register' ? "Sign in" : "Back to Login"}
                </button>
            </p>
        </div>
    );
};

export default AuthPopover;