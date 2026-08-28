import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const ErrorMessage = ({ message }: { message: string | null }): React.JSX.Element | null =>
  message ? <Text style={styles.error}>{message}</Text> : null;

const styles = StyleSheet.create({
  error: { color: '#B42318', marginVertical: 8, textAlign: 'center' },
});
