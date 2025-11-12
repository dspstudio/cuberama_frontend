import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Tooltip from './Tooltip';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setName('');
      setEmail('');
      setMessage('');
      setError(null);
      setSubmitted(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !message) {
      setError('Please fill out all fields.');
      return;
    }
    
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Contact Form Submitted:', { name, email, message });

    setLoading(false);
    setSubmitted(true);
  };

  const inputClasses = "w-full px-4 py-2 bg-[#0A0E1A] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors text-sm";
  const buttonClasses = "w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="bg-[#161A25] border border-white/10 rounded-2xl w-full max-w-lg p-6 m-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="contact-modal-title" className="text-xl font-bold text-white">
            {submitted ? 'Message Sent!' : 'Contact Us'}
          </h2>
          <Tooltip text="Close" position="bottom">
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
              <X />
            </button>
          </Tooltip>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-gray-300">Thank you for your message. We'll get back to you shortly.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-blue-600/80 rounded-lg hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" id="name" className={inputClasses} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" id="email" className={inputClasses} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-2">Message</label>
              <textarea id="message" rows={5} className={`${inputClasses} resize-none`} value={message} onChange={e => setMessage(e.target.value)} required></textarea>
            </div>
            
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactFormModal;
