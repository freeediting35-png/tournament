import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
    getUserProfile,
    signInWithGoogle,
    checkRedirectResult,
    signOutUser,
    updateFreefireId,
} from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

/** Map Firebase error codes to user-friendly messages */
const friendlyAuthError = (code: string): string => {
    switch (code) {
        case 'auth/popup-blocked':
            return 'Popup was blocked. Retrying with redirect…';
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return 'Sign-in was cancelled. Please try again.';
        case 'auth/network-request-failed':
            return 'Network error — check your connection and try again.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized for sign-in. Contact admin.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a moment and try again.';
        case 'auth/internal-error':
            return 'An internal error occurred. Please try again later.';
        default:
            return 'Sign-in failed. Please try again.';
    }
};

export const useAuth = () => {
    const {
        user, loading, isNewUser, needsFreefireId,
        setUser, setLoading, setIsNewUser, setNeedsFreefireId, clearAuth,
    } = useAuthStore();
    const addToast = useUIStore(s => s.addToast);
    const redirectChecked = useRef(false);

    useEffect(() => {
        // 1) Check for a pending redirect result (mobile / popup-fallback flow)
        if (!redirectChecked.current) {
            redirectChecked.current = true;
            checkRedirectResult()
                .then(result => {
                    if (result) {
                        setUser(result.user);
                        setIsNewUser(result.isNewUser);
                        setNeedsFreefireId(!result.user.freefireId);
                        addToast({ type: 'success', message: `Welcome${result.isNewUser ? '' : ' back'}, ${result.user.displayName ?? 'Player'}!` });
                    }
                })
                .catch(() => {
                    // Redirect result errors are non-critical
                });
        }

        // 2) Listen for auth state changes
        const unsub = onAuthStateChanged(auth, async firebaseUser => {
            if (firebaseUser) {
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    if (profile) {
                        setUser(profile);
                        setNeedsFreefireId(!profile.freefireId);
                    }
                } catch {
                    // Firestore read failed — user stays null, they can retry
                }
            } else {
                clearAuth();
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            setUser(result.user);
            setIsNewUser(result.isNewUser);
            setNeedsFreefireId(!result.user.freefireId);
            addToast({ type: 'success', message: `Welcome${result.isNewUser ? '' : ' back'}, ${result.user.displayName ?? 'Player'}!` });
        } catch (err: any) {
            const code: string = err?.code ?? '';
            addToast({ type: 'error', message: friendlyAuthError(code), duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOutUser();
            clearAuth();
            addToast({ type: 'info', message: 'Signed out successfully.' });
        } catch {
            addToast({ type: 'error', message: 'Failed to sign out. Please try again.' });
        }
    };

    const saveFreefireId = async (freefireId: string, freefireName: string) => {
        if (!user) return;
        await updateFreefireId(user.uid, freefireId, freefireName);
        setUser({ ...user, freefireId, freefireName });
        setNeedsFreefireId(false);
    };

    return { user, loading, isNewUser, needsFreefireId, login, logout, saveFreefireId };
};
