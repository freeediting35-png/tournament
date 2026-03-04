import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';

export const signInWithGoogle = async (): Promise<{ user: UserProfile; isNewUser: boolean }> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const { user } = result;

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
