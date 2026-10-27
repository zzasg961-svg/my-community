import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import AuthCard from '../components/ui/auth-card.jsx';
import { supabase } from '../lib/supabase.js';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
};

/**
 * SignupPage 컴포넌트
 * 이름/이메일/비밀번호/전화번호를 입력받아 회원가입한다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/signup" element={ <SignupPage /> } />
 */
function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (form.password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        error.message.includes('already registered')
          ? '이미 가입된 이메일입니다.'
          : `회원가입에 실패했습니다. (${error.message})`,
      );
      return;
    }

    if (data.session) {
      navigate('/', { replace: true });
      return;
    }
    setForm(INITIAL_FORM);
    setInfoMessage('인증 메일을 보냈습니다. 메일의 링크를 눌러 인증을 완료한 뒤 로그인해주세요.');
  };

  return (
    <AuthCard title="회원가입" subtitle="디자이너들의 아카이브에 함께하세요">
      <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
        { infoMessage && <Alert severity="success">{ infoMessage }</Alert> }
        <TextField label="이름" required value={ form.name } onChange={ handleChange('name') } autoComplete="name" />
        <TextField label="이메일" type="email" required value={ form.email } onChange={ handleChange('email') } autoComplete="email" />
        <TextField
          label="비밀번호"
          type="password"
          required
          value={ form.password }
          onChange={ handleChange('password') }
          autoComplete="new-password"
          helperText="6자 이상"
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          required
          value={ form.passwordConfirm }
          onChange={ handleChange('passwordConfirm') }
          autoComplete="new-password"
        />
        <TextField
          label="전화번호"
          type="tel"
          placeholder="010-0000-0000"
          value={ form.phone }
          onChange={ handleChange('phone') }
          autoComplete="tel"
        />
        <Button type="submit" variant="contained" size="large" disabled={ isSubmitting } sx={{ mt: 1, py: 1.4 }}>
          { isSubmitting ? '가입 중...' : '가입하기' }
        </Button>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
        이미 회원이신가요?{ ' ' }
        <Link component={ RouterLink } to="/login" color="text.primary" sx={{ fontWeight: 600 }}>
          로그인
        </Link>
      </Box>
    </AuthCard>
  );
}

export default SignupPage;
