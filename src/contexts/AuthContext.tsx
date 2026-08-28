import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/userService';
import { ChatUser } from '../types/user';

export type AuthContextValue = {
  user: ChatUser | null;
  loading: boolean;
  setUser: (user: ChatUser | null) => void;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = { children: React.ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps): React.JSX.Element => {
  const [user, setUserState] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((nextUser: ChatUser | null) => setUserState(nextUser), []);
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!auth.currentUser) {
      setUserState(null);
      return;
    }
    setUserState(await getUserProfile(auth.currentUser.uid));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      try {
        if (!firebaseUser) {
          setUserState(null);
          return;
        }
        setUserState(await getUserProfile(firebaseUser.uid));
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, setUser, refreshProfile }),
    [user, loading, setUser, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
