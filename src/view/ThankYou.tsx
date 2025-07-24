import React, { useState } from 'react';
import Player from 'lottie-react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import ShareToFarcaster from '../components/ShareToFarcaster';

// Remove next/font/local and next/image imports
// Use dynamic import for ThankuAnimationData
import ThankuAnimationData from '../public/ThankuAnimationData.json';

const styles = {
  containerBox: {
    height: 'calc(100vh - 196px)',
    display: 'flex',
    justifyContent: 'center',
    backgroundImage: "url('/LandingBackground.png')",
    backgroundRepeat: 'round',
  },
  mainBox: {
    display: 'flex',
    width: '90%',
    mx: 'auto',
    flexDirection: 'column',
    my: 'auto',
  },
  heading: {
    fontSize: { md: '64px', xs: '32px' },
    fontWeight: 600,
    letterSpacing: { md: -3, xs: -1 },
  },
  textBox: {
    textAlign: 'center',
    '& .MuiTypography-root': { color: '#23343A' },
  },
  linkBox: {
    display: 'flex',
    mx: 'auto',
    height: { md: '64px', xs: '48px' },
    alignItems: 'center',
    marginTop: '16px',
    bgcolor: 'primary.contrastText',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    my: 3,
    overFlow: 'hidden',
  },
  linkText: {
    flexGrow: 1,
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  iconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #EBEBEB',
    height: '100%',
    px: { md: 2.2, xs: 1.5 },
  },
  copyButton: {
    backgroundColor: 'secondary.main',
    color: 'primary.contrastText',
    p: { md: '10px 24px', xs: '6px 18px' },
    fontSize: { md: 16, xs: 14 },
    mx: { md: 1, xs: 0.5 },
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'secondary.main',
    },
  },
};

export default function ThankYou({
  customURL,
  loading,
}: {
  customURL: string;
  loading: boolean;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(customURL || '');
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 1500);
  };
  return (
    <Box sx={styles.containerBox}>
      <Box sx={styles.mainBox} width={'100%'}>
        <Box sx={styles.textBox} position={'relative'} pt={'133px'}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
              mt: 10,
            }}
          >
            <Player
              autoplay
              loop
              animationData={ThankuAnimationData}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography sx={styles.heading}>
            <Box component={'span'}>
              ThankYou
            </Box>{' '}
            For Your Purchase
          </Typography>
          <Typography fontSize={{ md: 24, xs: 16 }}>
            Your personalized link page is now hosted forever.
          </Typography>
          <Typography fontSize={{ md: 24, xs: 16 }}>Share it!</Typography>
        </Box>
        <Box sx={styles.linkBox} width={{ md: '50%', sm: '75%', xs: '100%' }}>
          <Box sx={styles.iconBox}>
            <img
              src={'/ChainIcon.svg'}
              alt='Chain Icon'
              width={25.94}
              height={25.94}
            />
          </Box>
          <Box flexGrow={1} overflow={'hidden'} ml={1}>
            {loading ? (
              <>
                <Typography sx={styles.linkText}>Loading...</Typography>
              </>
            ) : (
              <>
                <Typography sx={styles.linkText}>{customURL}</Typography>
              </>
            )}
          </Box>
          <Tooltip
            title='Copied!'
            open={tooltipOpen}
            disableHoverListener
            disableFocusListener
            disableTouchListener
            placement='top'
            arrow
          >
            <Button sx={styles.copyButton} onClick={handleCopy}>
              Copy
            </Button>
          </Tooltip>
        </Box>
        <ShareToFarcaster customURL={customURL} />
      </Box>
    </Box>
  );
}
