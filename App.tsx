import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppContent } from './src/components/AppContent';

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <AppContent />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
});
