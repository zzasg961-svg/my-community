import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CommentSection from '../components/post/comment-section.jsx';
import LikeButton from '../components/post/like-button.jsx';
import StarRating from '../components/post/star-rating.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { formatDate } from '../utils/format-date.js';

const metaSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontSize: '0.85rem',
  color: 'text.secondary',
};

/**
 * PostDetailPage 컴포넌트
 * 게시물 내용, 작성자, 작성시간, 좋아요·별점, 댓글을 보여준다.
 *
 * Props: 없음 (URL 파라미터 id 사용)
 *
 * Example usage:
 * <Route path="/posts/:id" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const viewedPostRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      /** StrictMode 이중 실행 시 조회수가 두 번 오르지 않도록 방지 */
      if (viewedPostRef.current !== postId) {
        viewedPostRef.current = postId;
        await supabase.rpc('increment_view_count', { target_post_id: postId });
      }
      const { data } = await supabase
        .from('posts_with_stats')
        .select('*')
        .eq('id', postId)
        .maybeSingle();
      if (isCancelled) return;
      setPost(data);
      setCommentCount(data?.comment_count ?? 0);
      setIsLoading(false);
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm('게시물을 삭제할까요? 댓글도 함께 삭제됩니다.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="inherit" size={ 28 } />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>존재하지 않거나 삭제된 게시물입니다.</Alert>
        <Button component={ RouterLink } to="/" variant="outlined">목록으로</Button>
      </Box>
    );
  }

  const isOwner = profile?.id === post.user_id;
  const isEdited = new Date(post.updated_at) - new Date(post.created_at) > 1000;

  return (
    <Box>
      <Button
        component={ RouterLink }
        to="/"
        color="secondary"
        startIcon={ <ArrowBackIosNewIcon sx={{ fontSize: '0.8rem !important' }} /> }
        sx={{ mb: 2, px: 1 }}
      >
        목록
      </Button>

      <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 2.5, md: 5 } }}>
        <Box component="header">
          <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>No. { post.id }</Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontSize: { xs: '1.5rem', md: '2.25rem' }, lineHeight: 1.3, wordBreak: 'break-word' }}
          >
            { post.title }
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{ post.author_name }</Box>
            <Box component="span" sx={ metaSx }>
              { formatDate(post.created_at) }{ isEdited && ' (수정됨)' }
            </Box>
            <Box component="span" sx={ metaSx }>
              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />{ post.view_count }
            </Box>
            <Box component="span" sx={ metaSx }>
              <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />{ commentCount }
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        { post.image_url && (
          <Box
            component="img"
            src={ post.image_url }
            alt={ post.title }
            sx={{ display: 'block', width: '100%', maxHeight: 640, objectFit: 'contain', borderRadius: 3, bgcolor: 'background.default', mb: 4 }}
          />
        ) }

        <Box
          sx={{
            fontSize: { xs: '1rem', md: '1.05rem' },
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: 120,
          }}
        >
          { post.content }
        </Box>

        <Box sx={{ mt: { xs: 5, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <LikeButton postId={ post.id } />
          <StarRating postId={ post.id } />
        </Box>

        { isOwner && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button component={ RouterLink } to={ `/posts/${post.id}/edit` } variant="outlined" size="small">
              수정
            </Button>
            <Button color="error" variant="outlined" size="small" onClick={ handleDelete }>
              삭제
            </Button>
          </Box>
        ) }

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        <CommentSection postId={ post.id } onCountChange={ setCommentCount } />
      </Paper>
    </Box>
  );
}

export default PostDetailPage;
