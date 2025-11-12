import React from 'react';
import WidgetCard from './WidgetCard';
import { ArrowUpRight } from 'lucide-react';
import Tooltip from '../../Tooltip';

interface AIInsightsProps {
    className?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ className = '' }) => {
    return (
        <WidgetCard className={`relative !p-0 ${className}`}>
            <div 
                className="absolute inset-0 bg-black opacity-80 overflow-hidden rounded-2xl"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 100% 100%, #1e40af 0, transparent 30%),
                        linear-gradient(to right, #ffffff08 1px, transparent 1px),
                        linear-gradient(to bottom, #ffffff08 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 2rem 2rem, 2rem 2rem',
                }}
            ></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-white font-semibold mb-4">AI Insights</h3>
                    <div className="flex space-x-1.5 mb-6">
                        <span className="block w-5 h-1.5 bg-white rounded-full"></span>
                        <span className="block w-5 h-1.5 bg-white/30 rounded-full"></span>
                        <span className="block w-5 h-1.5 bg-white/30 rounded-full"></span>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <p className="text-xl font-medium text-white max-w-xs">
                        Savings rate increased due to reduced discretionary spending.
                    </p>
                    <Tooltip text="View Full Insight" align="end">
                        <button className="flex-shrink-0 w-10 h-10 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </WidgetCard>
    );
};

export default AIInsights;