import React from 'react';
import { Box, Typography } from '@mui/material';

const styles = {
  containerBox: {
    '& .MuiTypography-root': {
      fontFamily: 'Redacted',
      fontSize: '18px',
    },
    borderRadius: '16px',
    textAlign: 'center',
    p: { md: 3, xs: 1.5 },
  },
  buttonOuterBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: { md: 2, xs: 1.5 },
  },
  buttonBoxDark: {
    borderRadius: '8px',
    bgcolor: 'primary.contrastText',
  },
  buttonBoxLight: {
    borderRadius: '8px',
    bgcolor: 'dark.main',
  },
};
export function DarkTheme({
  selectedTheme,
  themeName,
}: {
  selectedTheme: string;
  themeName: string;
}) {
  return (
    <Box
      sx={{
        ...styles.containerBox,
        bgcolor: 'dark.main',
        border: '2px solid #252525',
      }}
    >
      <Box
        sx={{
          '& .MuiTypography-root': {
            color: 'primary.contrastText',
          },
        }}
      >
        <Typography sx={{ fontSize: { md: '19.61px', xs: '18px' } }}>
          Jakob
        </Typography>
        <Typography sx={{ fontSize: { md: 18, xs: 13 } }}>
          People who like new things
        </Typography>
      </Box>
      <Box sx={styles.buttonOuterBox}>
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxDark,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },
          }}
        >
          <Typography>Instagram</Typography>
        </Box>
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxDark,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },
          }}
        >
          <Typography>YouTube</Typography>
        </Box>
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxDark,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },

            display: { md: 'unset', xs: 'none' },
          }}
        >
          <Typography>TikTok</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function LightTheme({
  selectedTheme,
  themeName,
}: {
  selectedTheme: string;
  themeName: string;
}) {
  return (
    <Box
      sx={{
        ...styles.containerBox,
        bgcolor: 'contrastText',
        border: '2px solid #F3F4F9',
      }}
    >
      <Box
        sx={{
          '& .MuiTypography-root': {
            color: 'dark.main',
          },
        }}
      >
        <Typography sx={{ fontSize: { md: '19.61px', xs: '18px' } }}>
          Jakob
        </Typography>
        <Typography sx={{ fontSize: { md: 18, xs: 13 } }}>
          People who like new things
        </Typography>
      </Box>
      <Box
        sx={{
          ...styles.buttonOuterBox,
          '& .MuiTypography-root': {
            color: 'primary.contrastText',
          },
        }}
      >
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxLight,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },
          }}
        >
          <Typography>Instagram</Typography>
        </Box>
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxLight,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },
          }}
        >
          <Typography>YouTube</Typography>
        </Box>
        <Box
          className='hoverable-button'
          sx={{
            ...styles.buttonBoxLight,
            py:
              selectedTheme === themeName
                ? { md: 1.75, xs: 0.75 }
                : { md: 2, xs: 1 },

            display: { md: 'unset', xs: 'none' },
          }}
        >
          <Typography>TikTok</Typography>
        </Box>
      </Box>
    </Box>
  );
}
