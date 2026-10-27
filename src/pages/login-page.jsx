import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호 로그인 화면
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/login" element={ <LoginPage /> } />
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(
        error.message.includes('Email not confirmed')
          ? '이메일 인증이 완료되지 않았습니다. 받은 메일함을 확인해주세요.'
          : '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
      return;
    }
    navigate(location.state?.from ?? '/', { replace: true });
  };

  return (
    <AuthCard title="로그인" subtitle="Design archive에 오신 것을 환영합니다">
      <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          required
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
        />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          required
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
        />
        <Button type="submit" variant="contained" size="large" disabled={ isSubmitting } sx={{ mt: 1, py: 1.4 }}>
          { isSubmitting ? '로그인 중...' : '로그인' }
        </Button>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
        아직 회원이 아니신가요?{ ' ' }
        <Link component={ RouterLink } to="/signup" color="text.primary" sx={{ fontWeight: 600 }}>
          회원가입
        </Link>
      </Box>
    </AuthCard>
  );
}

export default LoginPage;
