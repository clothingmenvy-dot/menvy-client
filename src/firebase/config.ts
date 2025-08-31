import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMkQ3pr2XjtSjHtiLu7XDXRajpJZuSQeA",
  authDomain: "manve-clothing.firebaseapp.com",
  projectId: "manve-clothing",
  storageBucket: "manve-clothing.firebasestorage.app",
  messagingSenderId: "650025852697",
  appId: "1:650025852697:web:8b8f7150d52c947347af88"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;