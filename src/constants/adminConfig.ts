export const ADMIN_CREDENTIALS = {
    // These are checked server-side only. Do NOT compare in frontend code.
    usernameEnvKey: 'ADMIN_USERNAME',
    passwordEnvKey: 'ADMIN_PASSWORD',
    jwtSecretEnvKey: 'ADMIN_JWT_SECRET',
    sessionDurationHours: 4,
};

// Admin session storage key (in-memory only, not localStorage)
export const ADMIN_TOKEN_KEY = '__bf_admin_token__';
