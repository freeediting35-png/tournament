import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyDeUHLMvQw5NXJ5HZR5lJ9Da7N7ZqBhjpo",
    authDomain: "cyber-rpg.firebaseapp.com",
    projectId: "cyber-rpg",
    storageBucket: "cyber-rpg.firebasestorage.app",
    messagingSenderId: "986429953692",
    appId: "1:986429953692:web:62e271be56419dcc3cff59",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (optional)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
    analytics = getAnalytics(app);
} catch (_) { }

// FCM — only works in browsers that support it
export const getMessagingInstance = async () => {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
};
