import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

/**
 * AuthCard 컴포넌트
 * 로그인/회원가입 화면에서 사용하는 중앙 카드 레이아웃
 *
 * Props:
 * @param {string} title - 카드 제목 [Required]
 * @param {string} subtitle - 제목 아래 설명 문구 [Optional]
 * @param {node} children - 카드 본문(폼 등) [Required]
 *
 * Example usage:
 * <AuthCard title="로그인" subtitle="다시 오신 것을 환영합니다"><form /></AuthCard>
 */
function AuthCard({ title, subtitle, children }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, fontSize: { xs: '1.6rem', md: '2rem' }, letterSpacing: '-0.03em', textAlign: 'center' }}
        >
          { title }
        </Typography>
        { subtitle && (
          <Typography sx={{ mt: 1, mb: 4, color: 'text.secondary', textAlign: 'center', fontSize: { xs: '0.9rem', md: '0.95rem' } }}>
            { subtitle }
          </Typography>
        ) }
        { children }
      </Paper>
    </Box>
  );
}

export default AuthCard;
