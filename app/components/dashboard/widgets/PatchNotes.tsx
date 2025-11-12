import React from 'react';
import WidgetCard from './WidgetCard';
import { Sparkles, Bug, Zap } from 'lucide-react';

const patchNotes = {
  version: 'v1.2.0',
  date: 'Mar 26, 2024',
  changes: [
    { type: 'new', text: 'Dashboard layout updated to a three-column view.', Icon: Zap },
    { type: 'new', text: 'Transactions are now directly on the dashboard.', Icon: Zap },
    { type: 'fix', text: 'Fixed a bug with avatar uploads.', Icon: Bug },
    { type: 'improvement', text: 'Improved sidebar navigation performance.', Icon: Sparkles },
  ],
};

const PatchNotes: React.FC = () => {
    return (
        <WidgetCard title="What's New">
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-lg text-white">{patchNotes.version}</h4>
                    <p className="text-sm text-gray-400">{patchNotes.date}</p>
                </div>
                <ul className="space-y-3">
                    {patchNotes.changes.map((change, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <change.Icon className={`w-4 h-4 ${change.type === 'new' ? 'text-cyan-400' : change.type === 'fix' ? 'text-red-400' : 'text-amber-400'}`} />
                            </div>
                            <span className="text-sm text-gray-300">{change.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </WidgetCard>
    );
};

export default PatchNotes;
