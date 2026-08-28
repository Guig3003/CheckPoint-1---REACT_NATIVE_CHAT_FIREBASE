import React, { useEffect, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { useChat } from '../hooks/useChat';
import { ChatUser } from '../types/user';

export const ChatScreen = ({ currentUser, otherUser, onBack }: { currentUser: ChatUser; otherUser: ChatUser; onBack: () => void }): React.JSX.Element => {
  const { messages, loading, sending, error, send } = useChat(currentUser, otherUser);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, [messages.length]);

  if (loading) return <Loading label="Abrindo conversa..." />;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
        <View style={styles.headerInfo}><Text style={styles.name}>{otherUser.name}</Text><Text style={styles.provider}>{otherUser.provider}</Text></View>
      </View>
      <ErrorMessage message={error} />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatMessage message={item} mine={item.senderId === currentUser.uid} />}
        contentContainerStyle={messages.length === 0 ? styles.emptyList : styles.messages}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma mensagem ainda. Envie a primeira!</Text>}
        onContentSizeChange={() => messages.length > 0 && listRef.current?.scrollToEnd({ animated: false })}
      />
      <ChatInput onSend={send} sending={sending} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F7FB' },
  header: { minHeight: 66, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E4E7EC' },
  back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 38, color: '#143D73', lineHeight: 40 },
  headerInfo: { flex: 1 },
  name: { fontSize: 17, fontWeight: '800', color: '#172B4D' },
  provider: { marginTop: 2, color: '#667085', textTransform: 'capitalize', fontSize: 12 },
  messages: { padding: 14 },
  emptyList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  empty: { color: '#667085', textAlign: 'center' },
});
