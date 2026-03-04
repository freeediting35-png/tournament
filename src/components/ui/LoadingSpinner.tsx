import React from 'react';

const LoadingSpinner: React.FC<{ size?: number; message?: string }> = ({ size = 40, message }) => (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
            <div
                className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
                style={{ width: size, height: size }}
            />
            <div
                className="absolute inset-1 rounded-full border-4 border-secondary/10 border-t-secondary animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}
            />
        </div>
        {message && <p className="text-text-secondary text-sm font-body">{message}</p>}
    </div>
);

export default LoadingSpinner;
