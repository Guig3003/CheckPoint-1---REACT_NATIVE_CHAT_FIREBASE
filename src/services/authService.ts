import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { saveUserProfile } from './userService';
import { AuthProviderType, ChatUser } from '../types/user';

const toChatUser = (user: User, provider: AuthProviderType): ChatUser => ({
  uid: user.uid,
  name: user.displayName?.trim() || user.email?.split('@')[0] || 'Usuário',
  email: user.email,
  provider,
});

export const registerWithEmail = async (name: string, email: string, password: string): Promise<ChatUser> => {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  const profile: ChatUser = { ...toChatUser(credential.user, 'password'), name: name.trim() };
  await saveUserProfile(profile);
  return profile;
};

export const loginWithEmail = async (email: string, password: string): Promise<ChatUser> => {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const profile = toChatUser(credential.user, 'password');
  await saveUserProfile(profile);
  return profile;
};

export const loginWithGoogleIdToken = async (idToken: string): Promise<ChatUser> => {
  const result = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  const profile = toChatUser(result.user, 'google');
  await saveUserProfile(profile);
  return profile;
};

export const loginWithApple = async (): Promise<ChatUser> => {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });
  if (!appleCredential.identityToken) throw new Error('A Apple não retornou um token de identidade.');

  const provider = new OAuthProvider('apple.com');
  const firebaseCredential = provider.credential({ idToken: appleCredential.identityToken, rawNonce });
  const result = await signInWithCredential(auth, firebaseCredential);
  const appleName = [appleCredential.fullName?.givenName, appleCredential.fullName?.familyName]
    .filter((part): part is string => Boolean(part)).join(' ').trim();
  if (appleName && !result.user.displayName) await updateProfile(result.user, { displayName: appleName });
  const profile: ChatUser = {
    ...toChatUser(result.user, 'apple'),
    name: appleName || result.user.displayName || 'Usuário Apple',
  };
  await saveUserProfile(profile);
  return profile;
};

export const logout = async (): Promise<void> => signOut(auth);
