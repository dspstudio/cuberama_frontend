import React from 'react';
import { X } from 'lucide-react';
import Tooltip from './Tooltip';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <style>{`
        .info-modal-content::-webkit-scrollbar { width: 8px; }
        .info-modal-content::-webkit-scrollbar-track { background: transparent; }
        .info-modal-content::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 4px; border: 2px solid #161A25; }
      `}</style>
      <div
        className="bg-[#161A25] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] p-6 m-4 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="info-modal-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          <Tooltip text="Close" position="bottom">
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
              <X />
            </button>
          </Tooltip>
        </div>
        <div className="overflow-y-auto pr-4 info-modal-content">
            {children}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;