import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPMBuTBW4aYsb1HnUzfS40kUsr4soHPp0",
  authDomain: "admin-dashboard-login-4e051.firebaseapp.com",
  projectId: "admin-dashboard-login-4e051",
  storageBucket: "admin-dashboard-login-4e051.firebasestorage.app",
  messagingSenderId: "826354885543",
  appId: "1:826354885543:web:2b987c4ba6d857c0934c82"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;