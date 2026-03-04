import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc,
    query, where, orderBy, onSnapshot, Unsubscribe, increment
} from 'firebase/firestore';
import { db } from './firebase';
import type { Tournament, Registration } from '../types';

// ── Tournaments ──────────────────────────────────────────
export const getTournaments = async (): Promise<Tournament[]> => {
    const snap = await getDocs(
        query(collection(db, 'tournaments'), orderBy('startDateTime', 'asc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Tournament);
};

export const getTournament = async (id: string): Promise<Tournament | null> => {
    const snap = await getDoc(doc(db, 'tournaments', id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Tournament) : null;
};

export const subscribeTournaments = (callback: (ts: Tournament[]) => void): Unsubscribe => {
    return onSnapshot(
        query(collection(db, 'tournaments'), orderBy('startDateTime', 'asc')),
        snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Tournament))
    );
};

export const createTournament = async (data: Omit<Tournament, 'id'>): Promise<string> => {
    const ref = await addDoc(collection(db, 'tournaments'), data);
    return ref.id;
};

export const updateTournament = async (id: string, data: Partial<Tournament>): Promise<void> => {
    await updateDoc(doc(db, 'tournaments', id), { ...data, updatedAt: new Date().toISOString() });
};

// ── Registrations ─────────────────────────────────────────
export const registerForTournament = async (
    registration: Omit<Registration, 'id'>
): Promise<string> => {
    // Increment filledSlots atomically
    await updateDoc(doc(db, 'tournaments', registration.tournamentId), {
        filledSlots: increment(1),
        registeredPlayers: [...([] as string[])], // will be proper array union in prod
    });
    const ref = await addDoc(collection(db, 'registrations'), registration);
    return ref.id;
};

export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
    const snap = await getDocs(
        query(collection(db, 'registrations'), where('userId', '==', userId))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Registration);
};

export const getTournamentRegistrations = async (tournamentId: string): Promise<Registration[]> => {
    const snap = await getDocs(
        query(collection(db, 'registrations'), where('tournamentId', '==', tournamentId))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Registration);
};

export const isUserRegistered = async (userId: string, tournamentId: string): Promise<boolean> => {
    const snap = await getDocs(
        query(
            collection(db, 'registrations'),
            where('userId', '==', userId),
            where('tournamentId', '==', tournamentId)
        )
    );
    return !snap.empty;
};

export const releaseRoomId = async (
    tournamentId: string,
    roomId: string,
    roomPassword: string
): Promise<void> => {
    await updateDoc(doc(db, 'tournaments', tournamentId), {
        roomId,
        roomPassword,
        updatedAt: new Date().toISOString(),
    });
};
