import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppHeader from './components/common/app-header.jsx';
import ProtectedRoute from './components/common/protected-route.jsx';
import LoginPage from './pages/login-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import PostListPage from './pages/post-list-page.jsx';
import PostWritePage from './pages/post-write-page.jsx';
import SignupPage from './pages/signup-page.jsx';

/**
 * App 컴포넌트
 * 공통 헤더와 페이지 라우팅을 담당한다.
 *
 * Props: 없음
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppHeader />
      <Box
        component="main"
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
          <Routes>
            <Route path="/" element={ <PostListPage /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/signup" element={ <SignupPage /> } />
            <Route path="/posts/:id" element={ <PostDetailPage /> } />
            <Route path="/write" element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> } />
            <Route path="/posts/:id/edit" element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
