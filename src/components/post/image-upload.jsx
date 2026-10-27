import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';

const MAX_SIZE = 5 * 1024 * 1024;

/**
 * ImageUpload 컴포넌트
 * 이미지 파일을 선택하고 미리보기를 보여준다. (실제 업로드는 부모가 처리)
 *
 * Props:
 * @param {File} file - 새로 선택된 파일 [Optional]
 * @param {string} existingUrl - 이미 업로드된 이미지 URL (수정 시) [Optional]
 * @param {function} onChange - 파일 선택/제거 시 호출 (file | null) => void [Required]
 * @param {function} onError - 파일 검증 실패 시 호출 (message) => void [Optional]
 *
 * Example usage:
 * <ImageUpload file={ file } existingUrl={ post.image_url } onChange={ setFile } />
 */
function ImageUpload({ file, existingUrl, onChange, onError }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl(existingUrl ?? '');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, existingUrl]);

  const handleSelect = (event) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      onError?.('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (selected.size > MAX_SIZE) {
      onError?.('이미지는 5MB 이하만 업로드할 수 있습니다.');
      return;
    }
    onChange(selected);
  };

  return (
    <Box>
      <input
        ref={ inputRef }
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        hidden
        onChange={ handleSelect }
      />
      { previewUrl ? (
        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <Box
            component="img"
            src={ previewUrl }
            alt="첨부 이미지 미리보기"
            sx={{ display: 'block', width: '100%', maxHeight: 360, objectFit: 'contain', bgcolor: 'background.default' }}
          />
          <IconButton
            aria-label="이미지 제거"
            onClick={ () => onChange(null) }
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={ <AddPhotoAlternateOutlinedIcon /> }
          onClick={ () => inputRef.current?.click() }
          sx={{ borderStyle: 'dashed', borderRadius: 2, width: '100%', py: 3 }}
        >
          사진 첨부 (5MB 이하)
        </Button>
      ) }
    </Box>
  );
}

export default ImageUpload;
