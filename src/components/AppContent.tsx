import React, { useCallback, useState } from 'react';
import { Loading } from './Loading';
import { useAuth } from '../hooks/useAuth';
import { ChatUser } from '../types/user';
import { LoginScreen } from '../screens/LoginScreen';
import { UsersScreen } from '../screens/UsersScreen';
import { ChatScreen } from '../screens/ChatScreen';

export const AppContent = (): React.JSX.Element => {
  const { user, loading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const clearSelection = useCallback(() => setSelectedUser(null), []);

  if (loading) return <Loading label="Restaurando sessão..." />;
  if (!user) return <LoginScreen />;
  if (selectedUser) return <ChatScreen currentUser={user} otherUser={selectedUser} onBack={clearSelection} />;
  return <UsersScreen currentUser={user} onSelect={setSelectedUser} />;
};
