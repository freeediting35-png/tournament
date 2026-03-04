import type { PaymentMethod, PaymentTransaction } from '../types';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const createFampayOrder = async (
    amount: number,
    userId: string,
    tournamentId: string
): Promise<{ orderId: string; paymentUrl?: string; qrCode?: string }> => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, userId, tournamentId }),
        });
        return await res.json();
    } catch {
        // Mock for development
        const orderId = `BF_${Date.now()}_${userId.slice(0, 6)}`;
        return { orderId, paymentUrl: `https://fampay.in/pay/${orderId}` };
    }
};

export const checkPaymentStatus = async (
    orderId: string
): Promise<'PENDING' | 'PAID' | 'FAILED'> => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/payment/status/${orderId}`);
        const data = await res.json();
        return data.status;
    } catch {
        return 'PENDING';
    }
};

export const deductFromWallet = async (
    userId: string,
    amount: number
): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/payment/wallet-deduct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount }),
        });
        return await res.json();
    } catch {
        return { success: false, message: 'Wallet service unavailable' };
    }
};

export const logPaymentTransaction = async (
    tx: Omit<PaymentTransaction, 'id'>
): Promise<void> => {
    await addDoc(collection(db, 'transactions'), tx);
};
