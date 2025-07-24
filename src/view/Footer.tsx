import React from 'react';
import { Box, Typography } from '@mui/material';

const styles = {
  containerBox: {
    bgcolor: '#1a1d21',
    justifyContent: 'center',
    display: 'flex',
    height: '80px',
  },
  contentBox: { display: 'flex', gap: 2, alignItems: 'center' },
};
export default function Footer() {
  return (
    <Box sx={styles.containerBox}>
      <Box sx={styles.contentBox}>
        <Typography color='primary.contrastText'>Presented by</Typography>
        <a href='http://www.33d.co/' target='_blank'>
          <img src="/Digital.png" alt="33 Digital" width={70} height={21} />
        </a>
      </Box>
    </Box>
  );
}
