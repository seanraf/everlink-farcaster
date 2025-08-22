import { useEffect, useState } from 'react';
import { Box } from '../components/Box';

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
        await response.json();
        setIsUserRegistered(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.log('Error registering user:', error);
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
          <Box className='m-auto text-gray-600'>
            No Template Selected For Preview
          </Box>
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
    <Box style={{ backgroundColor: '#F9FAFB' }}>
      <Box
        style={{
          display: activeStep === 0 || activeStep === 1 ? 'flex' : 'none',
          margin: '0 auto',
        }}
        className='md:w-11/12 mx-auto px-6 direction-row-column'
      >
        <Box
          className={`${
            activeStep === 0 ? 'w-[100%]' : '.theme-select-box m-0'
          }`}
        >
          <Box
            className={`mx-auto my-20 bg-white px-5 py-10 lg:${
              activeStep === 0 ? 'w-1/2' : 'w-11/12'
            } md:${activeStep === 0 ? 'w-2/3' : 'w-11/12'} `}
            style={{
              boxShadow: '0px 4.03px 12.89px 0px #080F340F',
              borderRadius: '12px',
            }}
          >
            <Box className='pb-4 mb-4 border-b border-gray-200'>
              <LinearStepper activeStep={activeStep} />
            </Box>
            {renderActiveStep()}
          </Box>
        </Box>
        <Box
          style={{
            display: activeStep === 0 ? 'none' : 'flex',
          }}
          className='theme-preview-box justify-center'
        >
          <Box className='render-theme-preview'>{renderThemePreview()}</Box>
        </Box>
      </Box>
      <Box style={{ display: activeStep === 2 ? 'flex' : 'none' }}>
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
