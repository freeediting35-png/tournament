import { getMessagingInstance } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        const messaging = await getMessagingInstance();
        if (!messaging) return null;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        return token;
    } catch {
        return null;
    }
};

export const setupMessageListener = async (
    onNotification: (payload: { title: string; body: string }) => void
): Promise<void> => {
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    onMessage(messaging, payload => {
        if (payload.notification) {
            onNotification({
                title: payload.notification.title ?? 'BlazeFire Arena',
                body: payload.notification.body ?? '',
            });
        }
    });
};

// Save FCM token to Firestore so admin can send targeted notifications
export const saveFCMToken = async (userId: string, token: string): Promise<void> => {
    try {
        await addDoc(collection(db, 'fcmTokens'), {
            userId,
            token,
            createdAt: new Date().toISOString(),
        });
    } catch { }
};
