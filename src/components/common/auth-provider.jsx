import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { AuthContext } from '../../hooks/auth-context.js';

/**
 * AuthProvider 컴포넌트
 * Supabase Auth 세션을 구독하고, users 테이블의 프로필을 함께 제공한다.
 *
 * Props:
 * @param {node} children - 인증 정보를 사용할 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('id, name')
      .eq('auth_id', authUser.id)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      /** 콜백 안에서 Supabase 호출 시 데드락을 피하기 위해 다음 틱에서 실행 */
      setTimeout(() => loadProfile(nextSession?.user), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ session, profile, isLoading, signOut }),
    [session, profile, isLoading, signOut],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
