import { createTheme, type ThemeOptions } from '@mui/material/styles';

interface CustomOptions extends ThemeOptions {
  dark: {
    main: string;
  };
}
export const theme = createTheme({
  palette: {
    primary: {
      main: '#855DCD',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1AB4A3',
      contrastText: '#6F6C90',
    },
    text: {
      primary: '#170F49',
      secondary: '#2D3648',
    },
    dark: {
      main: '#252525',
    },
  },
  typography: {
    allVariants: {
      textTransform: 'none',
      fontSize: 16,
    },
    fontFamily: 'Helvetica Neue',
  },
} as unknown as CustomOptions);
