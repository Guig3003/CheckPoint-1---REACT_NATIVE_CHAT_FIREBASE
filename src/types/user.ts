export type AuthProviderType = 'password' | 'google' | 'apple';

export type ChatUser = {
  uid: string;
  name: string;
  email: string | null;
  provider: AuthProviderType;
};
