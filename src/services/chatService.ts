import { get, onValue, push, ref, set } from 'firebase/database';
import { database } from './firebase';
import { ChatMessage, Conversation } from '../types/chat';
import { buildConversationId } from '../utils/chatRules';

export const getOrCreateConversation = async (currentUid: string, otherUid: string): Promise<Conversation> => {
  const id = buildConversationId(currentUid, otherUid);
  const conversationRef = ref(database, `conversations/${id}`);
  const snapshot = await get(conversationRef);

  if (snapshot.exists()) {
    const value = snapshot.val() as Omit<Conversation, 'id'>;
    return { id, ...value };
  }

  const conversation: Conversation = {
    id,
    participants: [currentUid, otherUid].sort() as [string, string],
    createdAt: Date.now(),
  };
  await set(conversationRef, { participants: conversation.participants, createdAt: conversation.createdAt });
  return conversation;
};

export const sendMessage = async (conversationId: string, senderId: string, receiverId: string, text: string): Promise<void> => {
  const trimmed = text.trim();
  if (!trimmed) return;
  const messageRef = push(ref(database, `messages/${conversationId}`));
  if (!messageRef.key) throw new Error('Não foi possível gerar o ID da mensagem.');
  const message: Omit<ChatMessage, 'id' | 'conversationId'> = {
    senderId,
    receiverId,
    text: trimmed,
    createdAt: Date.now(),
  };
  await set(messageRef, message);
};

export const subscribeToMessages = (
  conversationId: string,
  onMessages: (messages: ChatMessage[]) => void,
  onError: (message: string) => void,
): (() => void) => onValue(
  ref(database, `messages/${conversationId}`),
  snapshot => {
    const value = snapshot.val() as Record<string, Omit<ChatMessage, 'id' | 'conversationId'>> | null;
    const messages = value
      ? Object.entries(value).map(([id, item]) => ({ id, conversationId, ...item })).sort((a, b) => a.createdAt - b.createdAt)
      : [];
    onMessages(messages);
  },
  error => onError(error.message),
);
