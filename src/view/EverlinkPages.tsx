import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import Form from './Form';
import SelectTheme from './SelectTheme';
import Dark from './previews/Dark';
import Light from './previews/Light';
import Uploader from './Uploader';
import Minter from './Minter';
import { useAuth } from '@crossmint/client-sdk-react-ui';
import { useFrameContext } from '../providers/FarcasterContextProvider';
import LinearStepper from '../components/LinearStepper';
import { SnackbarAlert } from '../components/SnackbarAlert';
import type { UrlButton } from '../types';

const styles = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    mx: 'auto',
    my: '74px',
    bgcolor: 'primary.contrastText',
    p: { md: '40px 24px', xs: '24px 16px' },
    borderRadius: 3,
    boxShadow: '0px 4.03px 12.89px 0px #080F340F',
  },
  stepperBox: { borderBottom: '1px solid #D9DBE9', pb: 2, mb: 3 },
  previewBox: {
    width: { md: '90%', sm: '75%', xs: '90%' },
    mx: 'auto',
    display: 'flex',
  },
  loadingContainerBox: {
    height: 'calc(100vh - 72px)',
    display: 'flex',
    flexDirection: 'column',
    width: { md: '100%', xs: '90%' },
    mx: 'auto',
    pb: '72px',
  },
  loadingContentBox: {
    width: { lg: '30%', md: '40%', sm: '50%', xs: '75%' },
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    m: 'auto',
  },
};

export default function EverlinkPages() {
  const { user } = useAuth();
  const { context } = useFrameContext();
  const [activeStep, setActiveStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [analyticsTag, setAnalyticsTag] = useState('');
  const [deploymentTaskId, setDeploymentTaskId] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Dark Theme');
  const [urlButtons, setUrlButtons] = useState<UrlButton[]>([
    { id: '1', title: '', url: 'https://' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const registerUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fid: user?.farcaster?.fid ?? context?.user?.fid,
              username: user?.farcaster?.username ?? context?.user?.username,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to register the user');
        }
        const _result = await response.json();
        setIsUserRegistered(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // `Error` type includes the `message` property
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user || (context?.user && !isUserRegistered)) {
      registerUser();
    }
  }, [user, isUserRegistered, context?.user]);

  const renderThemePreview = () => {
    switch (selectedTheme) {
      case 'Dark Theme':
        return <Dark userName={userName} bio={bio} urlButtons={urlButtons} />;
      case 'Light Theme':
        return <Light userName={userName} bio={bio} urlButtons={urlButtons} />;
      default:
        return (
          <Typography m={'auto'} color='secondary.contrastText'>
            No Template Selected For Preview
          </Typography>
        );
    }
  };

  const renderActiveStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Form
            userName={userName}
            setUserName={setUserName}
            bio={bio}
            setBio={setBio}
            setActiveStep={setActiveStep}
            analyticsTag={analyticsTag}
            setAnalyticsTag={setAnalyticsTag}
            urlButtons={urlButtons}
            setUrlButtons={setUrlButtons}
          />
        );
      case 1:
        return (
          <>
            <SelectTheme
              setSelectedTheme={setSelectedTheme}
              selectedTheme={selectedTheme}
            />
            <Uploader
              userName={userName}
              bio={bio}
              setActiveStep={setActiveStep}
              urlButtons={urlButtons}
              selectedTheme={selectedTheme}
              setDeploymentTaskId={setDeploymentTaskId}
              setSnackbar={setSnackbar}
              setLoading={setLoading}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box bgcolor={'#F9FAFB'}>
      <Grid
        container
        mx={'auto'}
        width={{ md: '85%', xs: '100%' }}
        display={activeStep === 0 || activeStep === 1 ? 'flex' : 'none'}
      >
        <Grid
          size={{ md: activeStep === 0 ? 12 : 7.5, xs: 12 }}
          mx={activeStep === 0 ? 'auto' : 'unset'}
        >
          <Box
            sx={{
              width: {
                md: activeStep === 0 ? '50%' : '85%',
                sm: '70%',
                xs: '90%',
              },
              ...styles.mainBox,
            }}
          >
            {' '}
            <Box sx={styles.stepperBox}>
              <LinearStepper activeStep={activeStep} />
            </Box>
            {renderActiveStep()}
          </Box>
        </Grid>
        <Grid
          size={{ md: 4.5, xs: 12 }}
          sx={{
            display: activeStep === 0 ? 'none' : 'flex',
            px: { md: 3, xs: 'unset' },
            py: { md: '74px', xs: '10px' },

            justifyContent: 'center',
          }}
        >
          <Box sx={styles.previewBox}>{renderThemePreview()}</Box>
        </Grid>
      </Grid>
      <Box display={activeStep === 2 ? 'flex' : 'none'}>
        <Minter
          setActiveStep={setActiveStep}
          deploymentTaskId={deploymentTaskId}
          renderThemePreview={renderThemePreview}
          loading={loading}
        />
      </Box>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
