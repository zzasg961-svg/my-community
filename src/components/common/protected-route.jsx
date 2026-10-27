import { Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * ProtectedRoute 컴포넌트
 * 로그인하지 않은 사용자를 로그인 페이지로 이동시킨다.
 *
 * Props:
 * @param {node} children - 로그인 후 보여줄 컴포넌트 [Required]
 *
 * Example usage:
 * <ProtectedRoute><PostWritePage /></ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="inherit" size={ 28 } />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
