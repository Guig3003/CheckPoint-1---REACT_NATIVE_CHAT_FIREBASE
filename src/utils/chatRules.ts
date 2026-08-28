import { AuthProviderType, ChatUser } from '../types/user';

export const canProvidersChat = (first: AuthProviderType, second: AuthProviderType): boolean => {
  const firstIsPassword = first === 'password';
  const secondIsPassword = second === 'password';
  return firstIsPassword !== secondIsPassword && !(first !== 'password' && second !== 'password');
};

export const isCompatibleUser = (current: ChatUser, candidate: ChatUser): boolean =>
  current.uid !== candidate.uid && canProvidersChat(current.provider, candidate.provider);

export const buildConversationId = (uidA: string, uidB: string): string =>
  [uidA, uidB].sort().join('__');
