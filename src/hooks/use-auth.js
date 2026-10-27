import { useContext } from 'react';
import { AuthContext } from './auth-context.js';

/**
 * 인증 정보(session, profile, isLoading, signOut)를 반환하는 훅
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
