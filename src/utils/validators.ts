export const isValidFreefireId = (id: string): boolean => {
    return /^\d{8,12}$/.test(id.trim());
};

export const isValidFreefireName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 20;
};

export const isValidGiftCardCode = (code: string): boolean => {
    return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code.trim().toUpperCase());
};

export const isValidRedeemCode = (code: string): boolean => {
    return /^[A-Z0-9]{4,20}$/.test(code.trim().toUpperCase());
};

export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidTeamName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 30;
};

export const sanitizeInput = (input: string): string => {
    return input.replace(/[<>'"&]/g, '').trim();
};

export const getFreefireIdError = (id: string): string | null => {
    if (!id) return 'Free Fire UID is required';
    if (!/^\d+$/.test(id)) return 'UID must contain only numbers';
    if (id.length < 8) return 'UID must be at least 8 digits';
    if (id.length > 12) return 'UID must be at most 12 digits';
    return null;
};
