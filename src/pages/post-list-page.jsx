import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PostTable from '../components/post/post-table.jsx';
import { supabase } from '../lib/supabase.js';

const PAGE_SIZE = 10;

/**
 * PostListPage 컴포넌트
 * 게시물 목록을 페이지 단위로 보여준다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/" element={ <PostListPage /> } />
 */
function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const from = (page - 1) * PAGE_SIZE;

    supabase
      .from('posts_with_stats')
      .select('id, title, author_name, view_count, comment_count, image_url, created_at', { count: 'exact' })
      .order('id', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)
      .then(({ data, count, error }) => {
        if (isCancelled) return;
        if (error) {
          setErrorMessage('게시물을 불러오지 못했습니다.');
        } else {
          setPosts(data ?? []);
          setTotalCount(count ?? 0);
          setErrorMessage('');
        }
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2 }}
        >
          Design archive
        </Typography>
        <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.5 }}>
          좋은 디자인을 기록하고, 함께 이야기하는 공간
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' } }}>전체글</Box>
          <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>총 { totalCount }개</Box>
        </Box>

        { errorMessage && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{ errorMessage }</Alert> }

        { isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="inherit" size={ 28 } />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
            아직 게시물이 없습니다. 첫 글을 남겨보세요.
          </Box>
        ) : (
          <PostTable posts={ posts } />
        ) }
      </Paper>

      { pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={ pageCount }
            page={ page }
            shape="rounded"
            onChange={ (_event, value) => setSearchParams({ page: String(value) }) }
          />
        </Box>
      ) }
    </Box>
  );
}

export default PostListPage;
