import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number): string => {
    if (amount === 0) return 'FREE';
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
};

export const formatDateShort = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMM, hh:mm a');
};

export const formatRelativeTime = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const getCountdown = (targetDate: string): {
    days: number; hours: number; minutes: number; seconds: number; isExpired: boolean;
} => {
    const now = Date.now();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
};

export const padTime = (n: number): string => String(n).padStart(2, '0');

export const getSlotsColor = (filled: number, max: number): string => {
    const percent = (filled / max) * 100;
    if (percent >= 95) return '#FF1744';
    if (percent >= 75) return '#FFD600';
    return '#00C853';
};

export const getSlotsLabel = (filled: number, max: number): string => {
    const remaining = max - filled;
    if (remaining === 0) return 'FULL';
    if (remaining <= 5) return `⚡ ${remaining} slots left!`;
    return `${remaining} / ${max} slots`;
};

export const generateGiftCardCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [4, 4, 4, 4];
    return segments
        .map(len => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
        .join('-');
};

export const truncate = (str: string, max: number): string =>
    str.length > max ? `${str.slice(0, max)}...` : str;

export const getModeColor = (mode: string): string => {
    switch (mode) {
        case 'SOLO': return '#00E5FF';
        case 'DUO': return '#FFD700';
        case 'SQUAD': return '#FF4500';
        default: return '#ffffff';
    }
};
