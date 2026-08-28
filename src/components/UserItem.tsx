import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatUser } from '../types/user';

const providerLabel = { password: 'E-mail/Senha', google: 'Google', apple: 'Apple' } as const;

export const UserItem = ({ user, onPress }: { user: ChatUser; onPress: () => void }): React.JSX.Element => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={styles.avatar}><Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text></View>
    <View style={styles.info}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.provider}>{providerLabel[user.provider]}</Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E3E8EF' },
  pressed: { opacity: 0.7 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#143D73', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 18 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#172B4D' },
  provider: { marginTop: 3, fontSize: 13, color: '#667085' },
  chevron: { fontSize: 30, color: '#98A2B3' },
});
