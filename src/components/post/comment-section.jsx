import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/use-auth.js';
import { formatDate } from '../../utils/format-date.js';

/**
 * CommentSection 컴포넌트
 * 게시물의 댓글 목록과 댓글 입력칸을 제공한다.
 *
 * Props:
 * @param {number} postId - 대상 게시물 번호 [Required]
 * @param {function} onCountChange - 댓글 수가 바뀔 때 호출 (count) => void [Optional]
 *
 * Example usage:
 * <CommentSection postId={ 3 } onCountChange={ setCommentCount } />
 */
function CommentSection({ postId, onCountChange }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, users(name)')
      .eq('post_id', postId)
      .order('id', { ascending: true });
    const rows = data ?? [];
    setComments(rows);
    onCountChange?.(rows.length);
  }, [postId, onCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !profile) return;
    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: profile.id, content: trimmed });
    if (error) {
      setErrorMessage('댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      setContent('');
      await loadComments();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    await loadComments();
  };

  return (
    <Box component="section">
      <Box sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 2 }}>
        댓글 { comments.length }
      </Box>

      { profile ? (
        <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <TextField
            multiline
            minRows={ 2 }
            placeholder="댓글을 입력하세요"
            value={ content }
            onChange={ (event) => setContent(event.target.value) }
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            error={ Boolean(errorMessage) }
            helperText={ errorMessage || `${content.length}/1000` }
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={ isSubmitting || !content.trim() }>
              등록
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            fontSize: '0.9rem',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          댓글을 작성하려면{ ' ' }
          <Link component={ RouterLink } to="/login" color="text.primary" sx={{ fontWeight: 600 }}>
            로그인
          </Link>
          해주세요.
        </Box>
      ) }

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        { comments.map((comment, index) => (
          <Box component="li" key={ comment.id }>
            { index > 0 && <Divider /> }
            <Box sx={{ py: 2, display: 'flex', gap: 1 }}>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                  <Box component="span" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    { comment.users?.name ?? '알 수 없음' }
                  </Box>
                  <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    { formatDate(comment.created_at) }
                  </Box>
                </Box>
                <Box sx={{ fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  { comment.content }
                </Box>
              </Box>
              { profile?.id === comment.user_id && (
                <IconButton size="small" aria-label="댓글 삭제" onClick={ () => handleDelete(comment.id) } sx={{ alignSelf: 'flex-start' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) }
            </Box>
          </Box>
        )) }
      </Box>

      { comments.length === 0 && (
        <Box sx={{ py: 3, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
          첫 댓글을 남겨보세요.
        </Box>
      ) }
    </Box>
  );
}

export default CommentSection;
