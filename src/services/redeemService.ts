import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs, increment } from 'firebase/firestore';
import { db } from './firebase';
import type { GiftCard, RedeemCode } from '../types';

// ── Gift Cards ─────────────────────────────────
export const validateGiftCard = async (code: string): Promise<GiftCard | null> => {
    const normalizedCode = code.trim().toUpperCase();
    try {
        // Try to fetch from backend first; fallback to Firestore direct
        const snap = await getDocs(
            query(collection(db, 'giftCards'), where('code', '==', normalizedCode))
        );
        if (snap.empty) return null;
        const card = snap.docs[0].data() as GiftCard;
        if (card.isUsed) return null;
        if (new Date(card.expiresAt) < new Date()) return null;
        return card;
    } catch {
        return null;
    }
};

export const redeemGiftCard = async (
    code: string,
    userId: string
): Promise<{ success: boolean; value: number; message: string }> => {
    const normalizedCode = code.trim().toUpperCase();
    const snap = await getDocs(
        query(collection(db, 'giftCards'), where('code', '==', normalizedCode))
    );
    if (snap.empty) return { success: false, value: 0, message: 'Gift card not found' };

    const cardDoc = snap.docs[0];
    const card = cardDoc.data() as GiftCard;

    if (card.isUsed) return { success: false, value: 0, message: 'Gift card already used' };
    if (new Date(card.expiresAt) < new Date()) return { success: false, value: 0, message: 'Gift card expired' };

    await updateDoc(doc(db, 'giftCards', cardDoc.id), {
        isUsed: true,
        usedBy: userId,
        usedAt: new Date().toISOString(),
    });

    return { success: true, value: card.value, message: `₹${card.value} applied!` };
};

// ── Redeem Codes ───────────────────────────────
export const validateRedeemCode = async (
    code: string,
    tournamentId: string,
    entryFee: number
): Promise<{ valid: boolean; discount: number; message: string }> => {
    const normalizedCode = code.trim().toUpperCase();
    const snap = await getDocs(
        query(collection(db, 'redeemCodes'), where('code', '==', normalizedCode))
    );

    if (snap.empty) return { valid: false, discount: 0, message: 'Invalid redeem code' };

    const codeDoc = snap.docs[0];
    const rc = codeDoc.data() as RedeemCode;

    if (!rc.isActive) return { valid: false, discount: 0, message: 'Code is no longer active' };
    if (rc.currentUses >= rc.maxUses) return { valid: false, discount: 0, message: 'Code usage limit reached' };
    if (new Date(rc.expiresAt) < new Date()) return { valid: false, discount: 0, message: 'Code has expired' };
    if (rc.validTournaments !== 'ALL' && !rc.validTournaments.includes(tournamentId)) {
        return { valid: false, discount: 0, message: 'Code not valid for this tournament' };
    }

    let discount = 0;
    if (rc.type === 'FREE_ENTRY') discount = entryFee;
    else if (rc.type === 'PERCENTAGE') discount = Math.floor(entryFee * (rc.value / 100));
    else if (rc.type === 'FIXED') discount = Math.min(rc.value, entryFee);

    return { valid: true, discount, message: `Discount of ₹${discount} applied!` };
};

export const consumeRedeemCode = async (code: string): Promise<void> => {
    const normalizedCode = code.trim().toUpperCase();
    const snap = await getDocs(
        query(collection(db, 'redeemCodes'), where('code', '==', normalizedCode))
    );
    if (!snap.empty) {
        await updateDoc(doc(db, 'redeemCodes', snap.docs[0].id), {
            currentUses: increment(1),
        });
    }
};
