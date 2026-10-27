import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      /** HashRouter(#/...)와 충돌하지 않도록 인증 결과를 ?code= 쿼리로 받는다 */
      flowType: 'pkce',
    },
  },
);
