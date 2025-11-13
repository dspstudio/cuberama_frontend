'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Camera } from 'lucide-react';
import { GoogleIcon } from '../Icons';
import AvatarUploadModal from './AvatarUploadModal';
import ConfirmationModal from './ConfirmationModal';
import PasswordStrengthIndicator, { isPasswordStrong } from '../PasswordStrengthIndicator';
import Tooltip from '../Tooltip';
import { getAvatarUrl } from '@/app/lib/utils';

const getProviderInfo = (provider?: string) => {
    switch (provider) {
        case 'google':
            return {
                name: 'Google',
                Icon: GoogleIcon,
            };
        case 'email':
        default:
            return {
                name: 'Email & Password',
                Icon: Mail,
            };
    }
};

const AccountPage: React.FC = () => {
    const { user, signOut } = useAuth();
    
    // Profile State
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [wasNewPasswordFocused, setWasNewPasswordFocused] = useState(false);

    // Delete Account State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState<{ type: 'error'; text: string } | null>(null);

    const providerInfo = getProviderInfo(user?.app_metadata.provider);
    const { full_name, nickname: meta_nickname } = user?.user_metadata || {};
    const { email, id } = user || {};

    useEffect(() => {
        if (user) {
            setFullName(full_name || '');
            setNickname(meta_nickname || email?.split('@')[0] || '');
            setAvatarUrl(getAvatarUrl(user, 80));
        }
    }, [id, full_name, meta_nickname, email, user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);

        const { error } = await supabase.auth.updateUser({
            data: { 
                full_name: fullName,
                nickname: nickname
            }
        });

        setProfileLoading(false);

        if (error) {
            setProfileMessage({ type: 'error', text: error.message });
        } else {
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
    };

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

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        setDeleteMessage(null);

        const { error } = await supabase.rpc('delete_user');

        setDeleteLoading(false);
        setIsDeleteModalOpen(false);

        if (error) {
            setDeleteMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
        } else {
            await signOut();
        }
    };


    const handleAvatarUpdate = (newUrl: string) => {
        setAvatarUrl(newUrl);
        setProfileMessage({ type: 'success', text: 'Avatar updated successfully!' });
    };

    const inputClasses = "w-full px-4 py-2 bg-[#0A0E1A] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors text-sm h-10";
    const displayFieldClasses = "flex items-center w-full h-10 px-4 bg-[#161A25] border border-white/5 rounded-lg text-gray-400 text-sm";
    const labelClasses = "block text-xs font-medium text-gray-400 mb-2";
    const buttonClasses = "px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const userEmail = user?.email || '';

    return (
        <>
            <div className="space-y-12">
                <h1 className="text-3xl font-bold text-white">Account Settings</h1>

                {/* Profile Settings */}
                <form onSubmit={handleUpdateProfile} className="bg-[#161A25] border border-white/5 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="flex-shrink-0 w-20 h-20 mx-auto md:mx-0 relative group" key={avatarUrl}>
                            {avatarUrl ? (
                                <Image unoptimized src={avatarUrl} alt={fullName || 'User avatar'} width={80} height={80} className="w-20 h-20 rounded-full" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse"></div>
                            )}
                            <div className='absolute top-0 h-20 w-20'>
                             <Tooltip text="Change Avatar" position="bottom">
                                 <button 
                                    type="button" 
                                    onClick={() => setIsAvatarModalOpen(true)}
                                    className="h-full absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Change avatar"
                                >
                                    <Camera className="w-6 h-6" />
                                </button>
                            </Tooltip>
                            </div>
                        </div>
                        <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                                <input type="text" id="fullName" className={inputClasses} value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="nickname" className={labelClasses}>Nickname</label>
                                <input type="text" id="nickname" className={inputClasses} value={nickname} onChange={e => setNickname(e.target.value)} />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Email Address</label>
                                    <div className={displayFieldClasses}>
                                        {userEmail}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Sign-in Method</label>
                                    {providerInfo ? (
                                        <div className={displayFieldClasses}>
                                            <providerInfo.Icon className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="text-sm">{providerInfo.name}</span>
                                        </div>
                                    ) : (
                                        <div className="h-10 animate-pulse bg-[#0A0E1A] border border-white/10 rounded-lg" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end items-center gap-4">
                        {profileMessage && (
                            <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {profileMessage.text}
                            </p>
                        )}
                        <button type="submit" className={buttonClasses} disabled={profileLoading}>
                            {profileLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Change Password */}
                <form className="bg-[#161A25] border border-white/5 rounded-2xl p-6 sm:p-8">
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

                {/* Danger Zone */}
                <div className="bg-[#161A25] border border-red-500/30 rounded-2xl p-6 sm:p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
                             {deleteMessage && (
                                <p className="text-sm text-red-400 mb-4">{deleteMessage.text}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="font-semibold text-white">Delete your account</h3>
                            <p className="text-sm text-gray-400 mt-1 max-w-xl">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
            
            <AvatarUploadModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onAvatarUpdate={handleAvatarUpdate}
            />

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

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account Confirmation"
                isLoading={deleteLoading}
                confirmText="Yes, Delete My Account"
            >
                <p className="text-sm text-gray-300">
                    Are you absolutely sure? This action <span className="font-bold text-red-400">cannot</span> be undone. 
                    All of your data will be permanently deleted.
                </p>
            </ConfirmationModal>
        </>
    );
};

export default AccountPage;
