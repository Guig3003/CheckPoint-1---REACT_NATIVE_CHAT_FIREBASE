import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { ErrorMessage } from '../components/ErrorMessage';
import { loginWithApple, loginWithEmail, loginWithGoogleIdToken, registerWithEmail } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '566827232226-mglqfg23k23mse2mf2jsitf3be87l3r2.apps.googleusercontent.com';
const IOS_CLIENT_ID = '566827232226-8haqkmrpdbhc5c4vvvse40g8qslm4a3p.apps.googleusercontent.com';

export const LoginScreen = (): React.JSX.Element => {
  const { setUser } = useAuth();
  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const [, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (Platform.OS === 'ios') void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  useEffect(() => {
    const idToken = googleResponse?.type === 'success' ? googleResponse.params.id_token : undefined;
    if (!idToken) return;
    setLoading(true);
    setError(null);
    loginWithGoogleIdToken(idToken)
      .then(setUser)
      .catch(caught => setError(caught instanceof Error ? caught.message : 'Falha no Google Sign-In.'))
      .finally(() => setLoading(false));
  }, [googleResponse, setUser]);

  const buttonLabel = useMemo(() => (registerMode ? 'Criar conta' : 'Entrar'), [registerMode]);

  const submitEmail = useCallback(async (): Promise<void> => {
    if (!email.trim() || password.length < 6 || (registerMode && !name.trim())) {
      setError('Preencha os campos corretamente. A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const profile = registerMode
        ? await registerWithEmail(name, email, password)
        : await loginWithEmail(email, password);
      setUser(profile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  }, [email, password, registerMode, name, setUser]);

  const submitApple = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setUser(await loginWithApple());
    } catch (caught) {
      const code = caught instanceof Error && 'code' in caught
        ? String((caught as Error & { code?: string }).code)
        : '';
      if (code !== 'ERR_REQUEST_CANCELED') setError(caught instanceof Error ? caught.message : 'Falha no Apple Sign-In.');
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>CP1 Chat</Text>
        <Text style={styles.subtitle}>Firebase Authentication + Realtime Database</Text>
        {registerMode && <TextInput style={styles.input} placeholder="Nome completo" value={name} onChangeText={setName} editable={!loading} />}
        <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} editable={!loading} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} editable={!loading} />
        <ErrorMessage message={error} />
        <Pressable style={styles.primary} disabled={loading} onPress={() => void submitEmail()}>
          <Text style={styles.primaryText}>{loading ? 'Aguarde...' : buttonLabel}</Text>
        </Pressable>
        <Pressable disabled={loading} onPress={() => setRegisterMode(previous => !previous)}>
          <Text style={styles.link}>{registerMode ? 'Já tenho conta' : 'Criar conta com e-mail e senha'}</Text>
        </Pressable>
        <View style={styles.separator}><View style={styles.line} /><Text style={styles.or}>ou</Text><View style={styles.line} /></View>
        <Pressable style={styles.provider} disabled={loading} onPress={() => void promptGoogle()}>
          <Text style={styles.providerText}>Continuar com Google</Text>
        </Pressable>
        {appleAvailable && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={10}
            style={styles.appleButton}
            onPress={() => void submitApple()}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F4F7FB' },
  card: { backgroundColor: '#FFF', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: '#E4E7EC' },
  title: { fontSize: 30, fontWeight: '800', color: '#143D73', textAlign: 'center' },
  subtitle: { marginTop: 6, marginBottom: 24, textAlign: 'center', color: '#667085' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 12, minHeight: 48, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#FFF' },
  primary: { minHeight: 48, backgroundColor: '#143D73', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFF', fontWeight: '700' },
  link: { textAlign: 'center', color: '#175CD3', fontWeight: '600', marginTop: 14 },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E4E7EC' },
  or: { color: '#98A2B3' },
  provider: { minHeight: 48, borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  providerText: { color: '#344054', fontWeight: '700' },
  appleButton: { width: '100%', height: 48, marginTop: 12 },
});
