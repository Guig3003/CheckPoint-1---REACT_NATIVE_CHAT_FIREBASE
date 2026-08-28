import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '../contexts/AuthContext';

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
};
