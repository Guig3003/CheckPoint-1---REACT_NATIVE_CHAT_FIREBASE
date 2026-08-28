import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export const ChatInput = ({ onSend, sending }: { onSend: (text: string) => Promise<boolean>; sending: boolean }): React.JSX.Element => {
  const [text, setText] = useState('');
  const handleSend = useCallback(async () => {
    if (!text.trim() || sending) return;
    const sent = await onSend(text);
    if (sent) setText('');
  }, [text, sending, onSend]);

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Digite uma mensagem..."
        style={styles.input}
        multiline
        maxLength={1000}
      />
      <Pressable onPress={() => void handleSend()} disabled={!text.trim() || sending} style={styles.button}>
        {sending ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderColor: '#E4E7EC', backgroundColor: '#FFF' },
  input: { flex: 1, minHeight: 44, maxHeight: 120, backgroundColor: '#F2F4F7', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  button: { minHeight: 44, justifyContent: 'center', backgroundColor: '#143D73', paddingHorizontal: 18, borderRadius: 14 },
  buttonText: { color: '#FFF', fontWeight: '700' },
});
