import React, { useEffect, useState } from 'react';
import { getCountdown, padTime } from '../../utils/formatters';

interface CountdownTimerProps {
    targetDate: string;
    onExpire?: () => void;
    compact?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onExpire, compact }) => {
    const [time, setTime] = useState(getCountdown(targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            const t = getCountdown(targetDate);
            setTime(t);
            if (t.isExpired) {
                clearInterval(interval);
                onExpire?.();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (time.isExpired) {
        return (
            <span className="text-danger font-display font-bold text-sm tracking-wider">EXPIRED</span>
        );
    }

    if (compact) {
        return (
            <span className="timer-text text-secondary text-glow-gold tracking-wider">
                {time.days > 0 && `${time.days}d `}
                {padTime(time.hours)}:{padTime(time.minutes)}:{padTime(time.seconds)}
            </span>
        );
    }

    const units = [
        { label: 'DAYS', value: time.days },
        { label: 'HRS', value: time.hours },
        { label: 'MIN', value: time.minutes },
        { label: 'SEC', value: time.seconds },
    ];

    return (
        <div className="flex items-center gap-2 xl:gap-3">
            {units.map((u, i) => (
                <React.Fragment key={u.label}>
                    <div className="flex flex-col items-center">
                        <span
                            className="timer-text text-secondary text-glow-gold leading-none"
                            style={{ fontSize: 'clamp(18px, 3.5vw, 36px)' }}
                        >
                            {padTime(u.value)}
                        </span>
                        <span className="text-text-secondary font-mono text-[10px] tracking-widest mt-0.5">
                            {u.label}
                        </span>
                    </div>
                    {i < units.length - 1 && (
                        <span className="timer-text text-primary mb-3 text-lg">:</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CountdownTimer;
