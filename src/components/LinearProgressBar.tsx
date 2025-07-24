import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 0.1667;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        sx={{
          backgroundColor: '#D9D9D9',
          '& .MuiLinearProgress-bar': {
            backgroundImage:
              'linear-gradient(83.84deg, #0CAC9C 4.6%, #76E6D0 91.65%)',
          },
          height: '9px',
          borderRadius: '8px',
        }}
        variant='determinate'
        value={progress}
      />
    </Box>
  );
}
