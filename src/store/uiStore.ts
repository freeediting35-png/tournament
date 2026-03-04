import { create } from 'zustand';
import type { Toast } from '../types';

interface UIState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    toasts: [],
    addToast: toast => {
        const id = `toast_${Date.now()}_${Math.random()}`;
        set(state => ({ toasts: [...state.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), toast.duration ?? 4000);
    },
    removeToast: id => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
