import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DarkTheme, LightTheme } from './Themes';
import type { SelectThemeProps } from '../types';

const styles = {
  title: {
    fontSize: { md: 18, xs: 16 },
    fontWeight: 700,
    color: 'text.primary',
  },
  tagline: {
    fontSize: { md: 14, xs: 13 },
    color: 'secondary.contrastText',
    fontWeight: 500,
  },
  themeName: {
    fontWeight: 500,
    mb: 1,
    fontSize: { md: '16px', xs: '14px' },
  },
  buttonsBox: { display: 'flex', gap: 3, mt: 4 },
  buttons: {
    flex: 1,
    borderColor: 'secondary.main',
    borderRadius: '8px',
    fontWeight: 'bold',
    py: { md: 1.75, xs: 1 },
  },
};

export default function SelectTheme({
  selectedTheme,
  setSelectedTheme,
}: SelectThemeProps) {
  const handleCardClick = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const themeCards = [
    {
      id: 1,
      themeName: 'Dark Theme',
      theme: <DarkTheme selectedTheme={selectedTheme} themeName='Dark Theme' />,
    },
    {
      id: 2,
      themeName: 'Light Theme',
      theme: (
        <LightTheme selectedTheme={selectedTheme} themeName='Light Theme' />
      ),
    },
  ];

  return (
    <Box>
      <Typography sx={styles.title}>Choose Your Theme</Typography>
      <Typography sx={styles.tagline}>
        Pick a theme to style your page and give it a personal touch
      </Typography>
      <Grid container spacing={{ md: 3, xs: 2 }} mt={2}>
        {themeCards.map((card) => (
          <Grid size={6} key={card.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={styles.themeName}>{card?.themeName}</Typography>
              <CheckCircleIcon
                sx={{
                  color:
                    selectedTheme === card?.themeName ? '#2A80FF' : '#D9DBE9',
                }}
              />
            </Box>
            <Box
              sx={{
                borderRadius: '18px',
                border: '2px solid transparent',
                padding:
                  selectedTheme === card?.themeName
                    ? { md: 0.75, xs: 0.5 }
                    : '0px',
                borderColor:
                  selectedTheme === card?.themeName ? '#2A80FF' : 'none',
                '&:hover': {
                  borderColor: '#2A80FF',
                  padding: { md: 0.75, xs: 0.5 },
                  '& .hoverable-button': {
                    py: { md: 1.75, xs: 0.75 },
                  },
                },
                cursor: 'pointer',
              }}
              onClick={() => handleCardClick(card?.themeName)}
            >
              {card?.theme}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
