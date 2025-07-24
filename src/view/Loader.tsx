import React from 'react';
import { Box } from '@mui/material';

export default function Loader({ bgcolor = '#FFFFFF' }: { bgcolor?: string }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 72px)',
        display: 'flex',
        position: 'absolute',
        bgcolor: bgcolor,
      }}
    >
      <Box m={'auto'}>
        <img
          src={'/loader.gif'}
          alt='Loader'
          width={60}
          height={60}
          style={{ marginBottom: '70px' }}
        />
      </Box>
    </Box>
  );
}
