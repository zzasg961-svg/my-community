import { supabase } from '../lib/supabase.js';

const BUCKET = 'post-images';

/**
 * 이미지를 Supabase Storage에 업로드하고 공개 URL을 반환한다.
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} authId - 업로드하는 사용자의 auth uid (폴더명으로 사용)
 * @returns {Promise<string>} 공개 URL
 */
export async function uploadImage(file, authId) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${authId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
