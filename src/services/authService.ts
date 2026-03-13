import { auth, db } from './firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Creates or fetches the Firestore user profile from a Firebase UserCredential.
 */
export const resolveUserProfile = async (
    credential: UserCredential
): Promise<{ user: UserProfile; isNewUser: boolean }> => {
    const { user } = credential;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUser: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            freefireId: null,
            freefireName: null,
            joinedAt: new Date().toISOString(),
            tournaments: [],
            totalSpent: 0,
            redeemCodes: [],
            giftCards: [],
            wallet: 0,
        };
        await setDoc(userRef, newUser);
        return { user: newUser, isNewUser: true };
    }

    return { user: userSnap.data() as UserProfile, isNewUser: false };
};

/**
 * Attempts popup sign-in first; falls back to redirect on popup failure.
 */
export const signInWithGoogle = async (): Promise<{ user: UserProfile; isNewUser: boolean }> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return await resolveUserProfile(result);
    } catch (err: any) {
        const code: string = err?.code ?? '';

        // Popup was blocked or closed — fall back to redirect flow
        if (
            code === 'auth/popup-blocked' ||
            code === 'auth/popup-closed-by-user' ||
            code === 'auth/cancelled-popup-request'
        ) {
            await signInWithRedirect(auth, googleProvider);
            // The page will reload; the redirect result is handled in checkRedirectResult()
            // Return a never-resolving promise so callers don't proceed
            return new Promise(() => {});
        }

        // Re-throw everything else so the caller can show a toast
        throw err;
    }
};

/**
 * Call once on app start to resolve pending redirect sign-in (mobile flow).
 */
export const checkRedirectResult = async (): Promise<{ user: UserProfile; isNewUser: boolean } | null> => {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    return resolveUserProfile(result);
};

export const updateFreefireId = async (
    uid: string,
    freefireId: string,
    freefireName: string
): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { freefireId, freefireName });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const signOutUser = async (): Promise<void> => {
    await signOut(auth);
};
