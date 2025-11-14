'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PasswordStrengthIndicator, { isPasswordStrong } from './PasswordStrengthIndicator';
import ConfirmationModal from './dashboard/ConfirmationModal';

const UpdatePasswordForm: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [wasNewPasswordFocused, setWasNewPasswordFocused] = useState(false);

    const handlePasswordUpdate = async () => {
        if (!isPasswordStrong(newPassword) || newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Password requirements not met.' });
            setIsConfirmModalOpen(false);
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        setPasswordLoading(false);
        setIsConfirmModalOpen(false);

        if (error) {
            setPasswordMessage({ type: 'error', text: error.message });
        } else {
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
            setWasNewPasswordFocused(false);
        }
    };

    const handleOpenConfirmModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPasswordMessage(null);
        
        if (!newPassword || !confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Please fill in both password fields.' });
            return;
        }
        if (!isPasswordStrong(newPassword)) {
            setPasswordMessage({ type: 'error', text: 'New password does not meet all requirements.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const inputClasses = "w-full px-4 py-2 bg-[#0A0E1A] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors text-sm h-10";
    const labelClasses = "block text-xs font-medium text-gray-400 mb-2";
    const buttonClasses = "px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <>
            <form className="bg-[#161A25] border border-white/5 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto mt-10">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="newPassword" className={labelClasses}>New Password</label>
                        <input 
                          type="password" 
                          id="newPassword" 
                          className={inputClasses} 
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)} 
                          onFocus={() => setWasNewPasswordFocused(true)}
                          placeholder="••••••••" 
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={labelClasses}>Confirm New Password</label>
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          className={inputClasses} 
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)} 
                          onFocus={() => setWasNewPasswordFocused(true)}
                          placeholder="••••••••" 
                        />
                    </div>
                       {wasNewPasswordFocused && (
                        <div className="md:col-span-2">
                            <PasswordStrengthIndicator password={newPassword} />
                        </div>
                    )}
                </div>
                   <div className="mt-6 flex justify-end items-center gap-4">
                    {passwordMessage && (
                        <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {passwordMessage.text}
                        </p>
                    )}
                    <button onClick={handleOpenConfirmModal} className={buttonClasses} disabled={passwordLoading}>Change Password</button>
                </div>
            </form>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handlePasswordUpdate}
                title="Confirm Password Change"
                isLoading={passwordLoading}
                confirmText="Confirm Change"
            >
                <p className="text-sm text-gray-400">
                    Are you sure you want to change your password?
                </p>
            </ConfirmationModal>
        </>
    );
};

export default UpdatePasswordForm;
