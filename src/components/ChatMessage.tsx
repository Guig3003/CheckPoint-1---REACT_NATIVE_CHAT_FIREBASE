import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage as ChatMessageType } from '../types/chat';

export const ChatMessage = ({ message, mine }: { message: ChatMessageType; mine: boolean }): React.JSX.Element => (
  <View style={[styles.row, mine ? styles.mineRow : styles.otherRow]}>
    <View style={[styles.bubble, mine ? styles.mineBubble : styles.otherBubble]}>
      <Text style={[styles.text, mine && styles.mineText]}>{message.text}</Text>
      <Text style={[styles.time, mine && styles.mineTime]}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { width: '100%', marginVertical: 4 },
  mineRow: { alignItems: 'flex-end' },
  otherRow: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  mineBubble: { backgroundColor: '#143D73', borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E4E7EC' },
  text: { color: '#1D2939', fontSize: 15 },
  mineText: { color: '#FFF' },
  time: { marginTop: 5, fontSize: 10, color: '#98A2B3', textAlign: 'right' },
  mineTime: { color: '#D0D5DD' },
});
