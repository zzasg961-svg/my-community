import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ImageUpload from '../components/post/image-upload.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/use-auth.js';
import { uploadImage } from '../utils/upload-image.js';

/**
 * PostWritePage 컴포넌트
 * 게시물 작성과 수정(URL에 id가 있는 경우)을 처리한다.
 *
 * Props: 없음 (URL 파라미터 id 사용)
 *
 * Example usage:
 * <Route path="/write" element={ <PostWritePage /> } />
 * <Route path="/posts/:id/edit" element={ <PostWritePage /> } />
 */
function PostWritePage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode || !profile) return;
    supabase
      .from('posts')
      .select('title, content, image_url, user_id')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data || data.user_id !== profile.id) {
          navigate(`/posts/${id}`, { replace: true });
          return;
        }
        setTitle(data.title);
        setContent(data.content);
        setExistingImageUrl(data.image_url ?? '');
        setIsLoading(false);
      });
  }, [id, isEditMode, profile, navigate]);

  const handleImageChange = (file) => {
    setImageFile(file);
    if (!file) setExistingImageUrl('');
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile) {
      setErrorMessage('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      setErrorMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile, session.user.id) : existingImageUrl || null;
      const payload = { title: title.trim(), content: content.trim(), image_url: imageUrl };

      if (isEditMode) {
        const { error } = await supabase.from('posts').update(payload).eq('id', id);
        if (error) throw error;
        navigate(`/posts/${id}`, { replace: true });
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert({ ...payload, user_id: profile.id })
          .select('id')
          .single();
        if (error) throw error;
        navigate(`/posts/${data.id}`, { replace: true });
      }
    } catch (error) {
      setErrorMessage(`저장에 실패했습니다. (${error.message})`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="inherit" size={ 28 } />
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 2.5, md: 5 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, mb: { xs: 3, md: 4 } }}>
        { isEditMode ? '게시물 수정' : '새 게시물' }
      </Typography>
      <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
        <TextField
          label="제목"
          required
          value={ title }
          onChange={ (event) => setTitle(event.target.value) }
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <TextField
          label="내용"
          required
          multiline
          minRows={ 10 }
          value={ content }
          onChange={ (event) => setContent(event.target.value) }
        />
        <ImageUpload
          file={ imageFile }
          existingUrl={ existingImageUrl }
          onChange={ handleImageChange }
          onError={ setErrorMessage }
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <Button color="secondary" onClick={ () => navigate(-1) } disabled={ isSubmitting }>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={ isSubmitting }>
            { isSubmitting ? '저장 중...' : isEditMode ? '수정 완료' : '등록' }
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PostWritePage;
