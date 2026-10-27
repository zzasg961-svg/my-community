import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { formatListDate } from '../../utils/format-date.js';

const headCellSx = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'text.secondary',
  borderColor: 'divider',
  py: 1.5,
};

/**
 * PostTable 컴포넌트
 * 게시물 목록을 번호/제목/작성자/작성일/조회수 순서의 표로 보여준다.
 *
 * Props:
 * @param {Array} posts - posts_with_stats 뷰에서 조회한 게시물 배열 [Required]
 *
 * Example usage:
 * <PostTable posts={ posts } />
 */
function PostTable({ posts }) {
  const navigate = useNavigate();

  return (
    <Table sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{ ...headCellSx, width: { xs: 48, md: 72 } }}>번호</TableCell>
          <TableCell sx={ headCellSx }>제목</TableCell>
          <TableCell align="center" sx={{ ...headCellSx, width: 110, display: { xs: 'none', sm: 'table-cell' } }}>작성자</TableCell>
          <TableCell align="center" sx={{ ...headCellSx, width: 100, display: { xs: 'none', md: 'table-cell' } }}>작성일</TableCell>
          <TableCell align="center" sx={{ ...headCellSx, width: { xs: 56, md: 72 } }}>조회</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { posts.map((post) => (
          <TableRow
            key={ post.id }
            hover
            onClick={ () => navigate(`/posts/${post.id}`) }
            sx={{ cursor: 'pointer', '& td': { borderColor: 'divider' } }}
          >
            <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              { post.id }
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  { post.title }
                </Box>
                { post.image_url && <ImageOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} /> }
                { post.comment_count > 0 && (
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontSize: '0.8rem', color: 'text.secondary', flexShrink: 0 }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
                    { post.comment_count }
                  </Box>
                ) }
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: 'block', sm: 'none' }, mt: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
              >
                { post.author_name } · { formatListDate(post.created_at) }
              </Box>
            </TableCell>
            <TableCell
              align="center"
              sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              { post.author_name }
            </TableCell>
            <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: '0.85rem', color: 'text.secondary' }}>
              { formatListDate(post.created_at) }
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              { post.view_count }
            </TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}

export default PostTable;
