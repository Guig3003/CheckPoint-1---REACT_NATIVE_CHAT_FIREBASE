import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { UserItem } from '../components/UserItem';
import { logout } from '../services/authService';
import { subscribeToUsers } from '../services/userService';
import { ChatUser } from '../types/user';
import { isCompatibleUser } from '../utils/chatRules';
import { useAuth } from '../hooks/useAuth';

export const UsersScreen = ({ currentUser, onSelect }: { currentUser: ChatUser; onSelect: (user: ChatUser) => void }): React.JSX.Element => {
  const { setUser } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsers(
      next => { setUsers(next); setLoading(false); },
      message => { setError(message); setLoading(false); },
    );
    return unsubscribe;
  }, []);

  const compatibleUsers = useMemo(
    () => users.filter(candidate => isCompatibleUser(currentUser, candidate)),
    [users, currentUser],
  );

  const handleLogout = useCallback(async (): Promise<void> => {
    await logout();
    setUser(null);
  }, [setUser]);

  if (loading) return <Loading label="Buscando contatos compatíveis..." />;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View><Text style={styles.title}>Contatos</Text><Text style={styles.subtitle}>Olá, {currentUser.name}</Text></View>
        <Pressable onPress={() => void handleLogout()}><Text style={styles.logout}>Sair</Text></Pressable>
      </View>
      <ErrorMessage message={error} />
      <FlatList
        data={compatibleUsers}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => <UserItem user={item} onPress={() => onSelect(item)} />}
        contentContainerStyle={compatibleUsers.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<View><Text style={styles.emptyTitle}>Nenhum contato compatível</Text><Text style={styles.emptyText}>A regra permite apenas E-mail/Senha ↔ Google ou Apple.</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, padding: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { fontSize: 28, fontWeight: '800', color: '#172B4D' },
  subtitle: { color: '#667085', marginTop: 2 },
  logout: { color: '#B42318', fontWeight: '700', padding: 8 },
  list: { paddingBottom: 20 },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#344054' },
  emptyText: { marginTop: 8, textAlign: 'center', color: '#667085' },
});
