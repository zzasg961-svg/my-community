import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * StarRating 컴포넌트
 * 게시물 평균 별점을 보여주고, 로그인 사용자는 1~5점으로 평가할 수 있다.
 *
 * Props:
 * @param {number} postId - 대상 게시물 번호 [Required]
 *
 * Example usage:
 * <StarRating postId={ 3 } />
 */
function StarRating({ postId }) {
  const { profile } = useAuth();
  const [average, setAverage] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myScore, setMyScore] = useState(null);

  const loadRatings = useCallback(async () => {
    const { data } = await supabase.from('ratings').select('user_id, score').eq('post_id', postId);
    const rows = data ?? [];
    const total = rows.reduce((sum, row) => sum + row.score, 0);
    setRatingCount(rows.length);
    setAverage(rows.length ? total / rows.length : 0);
    setMyScore(profile ? rows.find((row) => row.user_id === profile.id)?.score ?? null : null);
  }, [postId, profile]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleChange = async (_event, value) => {
    if (!profile || !value) return;
    await supabase
      .from('ratings')
      .upsert({ post_id: postId, user_id: profile.id, score: value }, { onConflict: 'post_id,user_id' });
    await loadRatings();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rating value={ average } precision={ 0.1 } readOnly size="small" sx={{ color: 'text.primary' }} />
        <Box component="span" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
          { average.toFixed(1) } ({ ratingCount }명)
        </Box>
      </Box>
      { profile ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            { myScore ? '내 별점' : '별점 남기기' }
          </Box>
          <Rating value={ myScore } onChange={ handleChange } sx={{ color: 'text.primary' }} />
        </Box>
      ) : (
        <Box component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          로그인 후 별점을 남길 수 있어요
        </Box>
      ) }
    </Box>
  );
}

export default StarRating;
