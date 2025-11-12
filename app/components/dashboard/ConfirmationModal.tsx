import React from 'react';
import { X, Loader2 } from 'lucide-react';
import Tooltip from '../Tooltip';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isLoading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div
        className="bg-[#161A25] border border-white/10 rounded-2xl w-full max-w-md p-6 m-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="confirmation-modal-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          <Tooltip text="Close" position="bottom" align="end">
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
              <X />
            </button>
          </Tooltip>
        </div>
        
        <div className="mb-6">
            {children}
        </div>

        <div className="flex justify-end gap-4">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-gray-600/50 rounded-lg hover:bg-gray-600/80 transition-colors disabled:opacity-50"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center w-32"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;