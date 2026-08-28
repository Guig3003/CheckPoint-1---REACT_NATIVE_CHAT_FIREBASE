import { get, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';
import { ChatUser } from '../types/user';

const usersRef = ref(database, 'users');

export const saveUserProfile = async (user: ChatUser): Promise<void> => {
  await set(ref(database, `users/${user.uid}`), user);
};

export const getUserProfile = async (uid: string): Promise<ChatUser | null> => {
  const snapshot = await get(ref(database, `users/${uid}`));
  return snapshot.exists() ? (snapshot.val() as ChatUser) : null;
};

export const subscribeToUsers = (
  onUsers: (users: ChatUser[]) => void,
  onError: (message: string) => void,
): (() => void) => onValue(
  usersRef,
  snapshot => {
    const value = snapshot.val() as Record<string, ChatUser> | null;
    onUsers(value ? Object.values(value) : []);
  },
  error => onError(error.message),
);
