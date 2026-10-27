import { createTheme } from '@mui/material/styles';

/**
 * Design archive 모노톤 테마
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d1d1f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6e6e73',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#6e6e73',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    divider: '#e5e5ea',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 980,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        outlined: {
          borderColor: '#e5e5ea',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});

export default theme;
