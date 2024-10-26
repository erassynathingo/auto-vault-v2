import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUtSyLPH9SPV0e10aIxtEFXEsFqOD-oJM",
  authDomain: "auto-vault-7b761.firebaseapp.com",
  projectId: "auto-vault-7b761",
  storageBucket: "auto-vault-7b761.appspot.com",
  messagingSenderId: "25183999884",
  appId: "1:25183999884:web:34054c3f65d417524fe8a9",
  measurementId: "G-974LC024Q8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;