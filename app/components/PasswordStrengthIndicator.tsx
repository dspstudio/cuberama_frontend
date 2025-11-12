import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

interface ValidationRule {
  id: string;
  regex: RegExp;
  label: string;
}

export const passwordRules: ValidationRule[] = [
  { id: 'length', regex: /.{8,}/, label: 'At least 8 characters' },
  { id: 'uppercase', regex: /[A-Z]/, label: 'One uppercase letter' },
  { id: 'lowercase', regex: /[a-z]/, label: 'One lowercase letter' },
  { id: 'number', regex: /[0-9]/, label: 'One number' },
  { id: 'special', regex: /[!@#$%^&*()]/, label: 'One special character (!@#$%^&*())' },
];

export const isPasswordStrong = (password: string): boolean => {
    return passwordRules.every(rule => rule.regex.test(password));
};


const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  return (
    <div className="mt-3 text-xs">
      <p className="text-gray-400 mb-2 font-medium">Password must contain:</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {passwordRules.map((rule, index) => {
          const isValid = rule.regex.test(password);
          const isLastOddItem = passwordRules.length % 2 !== 0 && index === passwordRules.length - 1;
          
          return (
            <li 
              key={rule.id} 
              className={`flex items-center gap-2 transition-colors ${isValid ? 'text-green-400' : 'text-gray-400'} ${isLastOddItem ? 'sm:col-span-2' : ''}`}
            >
              {isValid ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400/70 flex-shrink-0" />}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;