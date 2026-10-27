import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * AppHeader 컴포넌트
 * 사이트 로고와 로그인 상태에 따른 메뉴를 표시하는 상단 바
 *
 * Props: 없음
 *
 * Example usage:
 * <AppHeader />
 */
function AppHeader() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={ 0 }
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 1 }}>
          <Typography
            component={ RouterLink }
            to="/"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              letterSpacing: '-0.02em',
              color: 'text.primary',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Design archive
          </Typography>

          { session ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.9rem', color: 'text.secondary', mr: 1 }}
              >
                { profile?.name ?? '' }님
              </Box>
              <Button
                component={ RouterLink }
                to="/write"
                variant="contained"
                size="small"
                startIcon={ <EditOutlinedIcon fontSize="small" /> }
              >
                글쓰기
              </Button>
              <Button size="small" color="secondary" onClick={ handleSignOut }>
                로그아웃
              </Button>
            </Box>
          ) : (
            <Button component={ RouterLink } to="/login" variant="contained" size="small">
              로그인
            </Button>
          ) }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
