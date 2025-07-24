import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

import {
  CrossmintCheckoutProvider,
  CrossmintHostedCheckout,
  useCrossmintCheckout,
} from '@crossmint/client-sdk-react-ui';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import type { MinterProps } from '../types';

const styles = {
  containerBox: {
    minHeight: 'calc(100vh - 73px)',
    display: 'flex',
    backgroundImage: "url('/LandingBackground.png')",
    backgroundRepeat: 'round',
    width: '100%',
  },
  mainBox: {
    width: '100%',
    my: 'auto',
  },
  heading: {
    fontSize: { md: '64px', xs: '32px' },
    fontWeight: 600,
    letterSpacing: { md: -3, xs: -1 },
  },
  shareToFarcaster: {
    width: 'fit-content',
    color: 'primary.main',
    gap: '8px',
    mx: 'auto',
    border: '2px solid #855DCD',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 'bold',
  },
  textBox: {
    '& .MuiTypography-root': { color: '#23343A' },
  },
  linkBox: {
    display: 'flex',
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
    filter: 'blur(4px)',
    userSelect: 'none',
    px: 1,
  },
  iconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #EBEBEB',
    height: '100%',
    px: { md: 2.2, xs: 1.5 },
  },
  previewBox: {
    width: { md: '90%', sm: '75%', xs: '90%' },
    display: 'flex',
  },
};

export default function Minter({
  setActiveStep,
  renderThemePreview,
  deploymentTaskId,
  loading,
}: MinterProps) {
  const projectId = import.meta.env.VITE_CROSSMINT_PROJECT_ID as string;
  const collectionId = import.meta.env.VITE_CROSSMINT_COLLECTION_ID as string;
  const environment = import.meta.env.VITE_CROSSMINT_ENVIRONMENT as string;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const crossmintBtnRef = useRef<HTMLDivElement>(null);
  return (
    <Box sx={styles.containerBox} position={'relative'}>
      {loading && <Loader bgcolor={'#FFFFFFCC'} />}
      <Grid container width={'90%'} mx={'auto'}>
        <Grid size={{ md: 7.5, xs: 12 }} display={'flex'}>
          {' '}
          <Box sx={styles.mainBox}>
            <Box sx={styles.textBox}>
              <Typography sx={styles.heading}>
                Your Link is{' '}
                <Box component={'span'}>
                  Ready
                </Box>{' '}
                ! 🎉
              </Typography>
              <Typography fontSize={{ md: 24, xs: 16 }}>
                To activate and make your link live forever,
                <br /> complete your payment now.
              </Typography>
            </Box>
            <Box
              sx={styles.linkBox}
              width={{ md: '60%', sm: '65%', xs: '100%' }}
            >
              <Box sx={styles.iconBox}>
                <img
                  src={'/ChainIcon.svg'}
                  alt='Chain Icon'
                  width={25.94}
                  height={25.94}
                />
              </Box>
              <Box flexGrow={1} overflow={'hidden'}>
                <Typography sx={styles.linkText}>
                  https://www.everlink.com/l5TzftrtkA_Nbc1uukUteXLSIgQhcFNZP-Hb4pJBtdg
                </Typography>
              </Box>
              <Box
                m={{
                  md: '8px 6px',
                  xs: '6px 2px',
                }}
              >
                <Box
                  position={'relative'}
                  bgcolor={'#1ab4a3'}
                  borderRadius={'8px'}
                  sx={{
                    padding: isLargeScreen ? '14px 22px' : '10px 18px',
                  }}
                >
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 900,
                      textAlign: 'center',
                      color: '#FFFFFF',
                    }}
                    onClick={() => {
                      const btn =
                        crossmintBtnRef.current?.querySelector('button');
                      if (btn) {
                        btn.click();
                      }
                    }}
                  >
                    Mint
                  </Typography>
                  <Box
                    ref={crossmintBtnRef}
                    sx={{
                      opacity: 0,
                      position: 'absolute',
                      pointerEvents: 'none',
                      width: 0,
                      height: 0,
                    }}
                  >
                    <CrossmintCheckoutProvider>
                      <CheckoutWithCallbacks
                        deploymentTaskId={deploymentTaskId}
                      />
                    </CrossmintCheckoutProvider>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          size={{ md: 4.5, xs: 12 }}
          sx={{
            display: 'flex',
            px: { md: 3, xs: 'unset' },
            py: '74px',
            justifyContent: { md: 'end', xs: 'center' },
          }}
        >
          <Box sx={styles.previewBox}>{renderThemePreview()}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function CheckoutWithCallbacks({ deploymentTaskId }: any) {
  const [showCheckout, setShowCheckout] = useState(true);

  const collectionId = import.meta.env.VITE_CROSSMINT_COLLECTION_ID as string;
  const { order } = useCrossmintCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    if (order && order.phase === 'completed') {
      navigate(
        `${import.meta.env.VITE_FRONTEND_BASE_URL}/success/${deploymentTaskId}`
      );
      setTimeout(() => {
        setShowCheckout(false);
      }, 2000);
    }

    if (order && order.lineItems) {
      const hasFailedItems = order.lineItems.some(
        (item) => item.delivery?.status === 'failed'
      );

      if (hasFailedItems) {
        navigate(`${import.meta.env.VITE_FRONTEND_BASE_URL}/failure`);
      }
    }
  }, [order, navigate, deploymentTaskId]);

  if (!showCheckout) {
    return <div>Payment successful! Thank you for your purchase.</div>;
  }

  return (
    <CrossmintHostedCheckout
      lineItems={{
        collectionLocator: `crossmint:${collectionId}`,
        callData: {
          totalPrice: '0.001',
          quantity: 1,
        },
      }}
      payment={{
        crypto: { enabled: true },
        fiat: { enabled: true },
      }}
      className='xmint-btn'
      appearance={{
        display: 'popup',
        overlay: { enabled: false },
      }}
    />
  );
}
