import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
    user: UserProfile | null;
    loading: boolean;
    isNewUser: boolean;
    needsFreefireId: boolean;
    adminToken: string | null;
    setUser: (user: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setIsNewUser: (v: boolean) => void;
    setNeedsFreefireId: (v: boolean) => void;
    setAdminToken: (token: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    loading: true,
    isNewUser: false,
    needsFreefireId: false,
    adminToken: null,
    setUser: user => set({ user }),
    setLoading: loading => set({ loading }),
    setIsNewUser: v => set({ isNewUser: v }),
    setNeedsFreefireId: v => set({ needsFreefireId: v }),
    setAdminToken: token => set({ adminToken: token }),
    clearAuth: () => set({ user: null, isNewUser: false, needsFreefireId: false, adminToken: null }),
}));
