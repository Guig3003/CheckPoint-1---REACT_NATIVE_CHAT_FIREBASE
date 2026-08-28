import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDHaXuidaK6w2U-DEUv2QZv_-fUmIs-L1M',
  authDomain: 'cp-1-mobile.firebaseapp.com',
  databaseURL: 'https://cp-1-mobile-default-rtdb.firebaseio.com',
  projectId: 'cp-1-mobile',
  storageBucket: 'cp-1-mobile.firebasestorage.app',
  messagingSenderId: '566827232226',
  appId: '1:566827232226:web:1ff8d582605528b57367bb',
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);
