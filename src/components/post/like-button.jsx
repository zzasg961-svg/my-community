import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * LikeButton 컴포넌트
 * 게시물 좋아요 수를 표시하고, 로그인 사용자는 좋아요를 토글할 수 있다.
 *
 * Props:
 * @param {number} postId - 대상 게시물 번호 [Required]
 *
 * Example usage:
 * <LikeButton postId={ 3 } />
 */
function LikeButton({ postId }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const loadLikes = useCallback(async () => {
    const { data } = await supabase.from('likes').select('user_id').eq('post_id', postId);
    const rows = data ?? [];
    setLikeCount(rows.length);
    setIsLiked(Boolean(profile && rows.some((row) => row.user_id === profile.id)));
  }, [postId, profile]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const handleToggle = async () => {
    if (!profile) {
      navigate('/login');
      return;
    }
    setIsPending(true);
    if (isLiked) {
      await supabase.from('likes').delete().match({ post_id: postId, user_id: profile.id });
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: profile.id });
    }
    await loadLikes();
    setIsPending(false);
  };

  return (
    <Button
      variant={ isLiked ? 'contained' : 'outlined' }
      color="primary"
      onClick={ handleToggle }
      disabled={ isPending }
      startIcon={ isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
      sx={{ minWidth: 112 }}
    >
      좋아요 { likeCount }
    </Button>
  );
}

export default LikeButton;
