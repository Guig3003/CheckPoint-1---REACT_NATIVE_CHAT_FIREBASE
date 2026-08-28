import { useCallback, useEffect, useState } from 'react';
import { ChatMessage } from '../types/chat';
import { ChatUser } from '../types/user';
import { getOrCreateConversation, sendMessage, subscribeToMessages } from '../services/chatService';

export const useChat = (currentUser: ChatUser, otherUser: ChatUser) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let removeListener: (() => void) | undefined;
    let active = true;
    const start = async (): Promise<void> => {
      try {
        setLoading(true);
        const conversation = await getOrCreateConversation(currentUser.uid, otherUser.uid);
        if (!active) return;
        setConversationId(conversation.id);
        removeListener = subscribeToMessages(
          conversation.id,
          next => active && setMessages(next),
          message => active && setError(message),
        );
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : 'Falha ao abrir conversa.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void start();
    return () => {
      active = false;
      removeListener?.();
    };
  }, [currentUser.uid, otherUser.uid]);

  const send = useCallback(async (text: string): Promise<boolean> => {
    if (!conversationId) return false;
    try {
      setSending(true);
      setError(null);
      await sendMessage(conversationId, currentUser.uid, otherUser.uid, text);
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Falha no envio da mensagem.');
      return false;
    } finally {
      setSending(false);
    }
  }, [conversationId, currentUser.uid, otherUser.uid]);

  return { messages, loading, sending, error, send };
};
