import React from 'react';

interface WidgetCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-[#161A25] border border-white/5 rounded-2xl p-6 ${className}`}>
            {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
            {children}
        </div>
    );
};

export default WidgetCard;
