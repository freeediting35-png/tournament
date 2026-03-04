import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, signInWithGoogle, signOutUser, updateFreefireId } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const { user, loading, isNewUser, needsFreefireId, setUser, setLoading, setIsNewUser, setNeedsFreefireId, clearAuth } = useAuthStore();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async firebaseUser => {
            if (firebaseUser) {
                const profile = await getUserProfile(firebaseUser.uid);
                if (profile) {
                    setUser(profile);
                    setNeedsFreefireId(!profile.freefireId);
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
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOutUser();
        clearAuth();
    };

    const saveFreefireId = async (freefireId: string, freefireName: string) => {
        if (!user) return;
        await updateFreefireId(user.uid, freefireId, freefireName);
        setUser({ ...user, freefireId, freefireName });
        setNeedsFreefireId(false);
    };

    return { user, loading, isNewUser, needsFreefireId, login, logout, saveFreefireId };
};
