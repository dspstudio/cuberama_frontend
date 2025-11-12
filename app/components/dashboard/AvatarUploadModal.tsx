import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Camera, Dices, X, Loader2 } from 'lucide-react';
import Tooltip from '../Tooltip';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate: (newUrl: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose, onAvatarUpdate }) => {
    const { user } = useAuth();
    const [cameraActive, setCameraActive] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setLoading(null);
            setError(null);
        }
    }, [isOpen, stopCamera]);


    const uploadFile = async (file: File) => {
        if (!user) {
            setError('You must be logged in to upload an avatar.');
            return;
        }
        setError(null);
        setLoading('Uploading...');

        try {
            const filePath = `${user.id}/avatar.png`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
                upsert: true,
                contentType: file.type,
            });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl + `?t=${new Date().getTime()}`;

            const { error: updateUserError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateUserError) throw updateUserError;

            onAvatarUpdate(publicUrl);
            onClose();

        } catch (err: any) {
            setError(err.message || 'Failed to upload avatar.');
        } finally {
            setLoading(null);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('File is too large. The maximum size is 2MB.');
                return;
            }
            uploadFile(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const startCamera = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            setError('Could not access camera. Please check permissions.');
            console.error(err);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            setLoading('Processing...');
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            
            canvasRef.current.toBlob(blob => {
                if (blob) {
                    uploadFile(new File([blob], 'avatar.png', { type: 'image/png' }));
                }
            }, 'image/png');
            stopCamera();
        }
    };

    const handleGenerateAvatar = async () => {
        if (!user) return;
        setLoading('Generating...');
        const newUrl = `https://i.pravatar.cc/150?u=${Date.now()}`;
         const { error } = await supabase.auth.updateUser({
            data: { avatar_url: newUrl }
        });
        if (error) {
            setError(error.message);
        } else {
            onAvatarUpdate(newUrl);
            onClose();
        }
        setLoading(null);
    };

    if (!isOpen) return null;

    const OptionButton: React.FC<{ Icon: React.ElementType, text: string, onClick: () => void, disabled?: boolean }> = ({ Icon, text, onClick, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex flex-col items-center justify-center gap-3 w-full h-32 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Icon className="w-8 h-8" />
            <span className="font-semibold">{text}</span>
        </button>
    );

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-[#161A25] border border-white/10 rounded-2xl w-full max-w-lg p-6 m-4 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Change Avatar</h2>
                    <Tooltip text="Close" position="bottom" align="end">
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X />
                        </button>
                    </Tooltip>
                </div>
                
                {loading && (
                    <div className="min-h-[200px] flex flex-col items-center justify-center text-white">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p>{loading}</p>
                    </div>
                )}
                
                {!loading && (
                    <>
                        {cameraActive ? (
                            <div className="space-y-4">
                                <video ref={videoRef} autoPlay className="w-full rounded-lg bg-black"></video>
                                <div className="flex gap-4">
                                     <button onClick={stopCamera} className="w-full px-5 py-2 text-sm font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                                    <button onClick={capturePhoto} className="w-full px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Take Photo</button>
                                </div>
                                <canvas ref={canvasRef} className="hidden"></canvas>
                            </div>
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <OptionButton Icon={Upload} text="Upload Photo" onClick={handleUploadClick} />
                                <OptionButton Icon={Camera} text="Use Camera" onClick={startCamera} />
                                <OptionButton Icon={Dices} text="Generate" onClick={handleGenerateAvatar} />
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                            </div>
                        )}
                        {error && <p className="text-sm text-red-400 mt-4 text-center">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default AvatarUploadModal;