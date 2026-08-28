import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const Loading = ({ label = 'Carregando...' }: { label?: string }): React.JSX.Element => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  text: { fontSize: 15, color: '#536071' },
});
