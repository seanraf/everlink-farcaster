import React, { useEffect, useState } from 'react';
import URLButtons from './URLButtons';
import { Box } from '../components/Box';
import * as Label from '@radix-ui/react-label';
import { useAuth } from '@crossmint/client-sdk-react-ui';
import { useFrameContext } from '../providers/FarcasterContextProvider';
import type { UrlButton, UrlButtonErrors } from '../types';

const Form = ({
  setActiveStep,
  userName,
  setUserName,
  bio,
  setBio,
  analyticsTag,
  setAnalyticsTag,
  urlButtons,
  setUrlButtons,
}: any) => {
  const { user } = useAuth();
  const { context } = useFrameContext();
  const [showOptionalField, setShowOptionalField] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [bioError, setBioError] = useState('');
  const [isInitialUsername, setIsInitialUsername] = useState(false);
  const [isInitialBio, setIsInitialBio] = useState(false);

  const [urlButtonErrors, setUrlButtonErrors] = useState<
    { id: string; title: string; url: string }[]
  >([{ id: '', title: '', url: '' }]);

  useEffect(() => {
    if (
      user?.farcaster?.username ||
      (context?.user.username && !isInitialUsername)
    ) {
      setUserName(user?.farcaster?.username ?? context?.user.username);
      setIsInitialUsername(true);
    }
  }, [user, context?.user, isInitialUsername, setUserName]);

  useEffect(() => {
    if (user?.farcaster?.bio && !isInitialBio) {
      setBio(user?.farcaster?.bio);
      setIsInitialBio(true);
    }
  }, [user, isInitialBio, setBio]);

  const toggleOptionalField = () => {
    setShowOptionalField((prev) => !prev);
  };

  const usernamePattern = /^[a-zA-Z0-9_\-@. ]*$/;

  const validateUsername = (username: string): string => {
    if (!username.trim()) {
      return 'Please enter your username';
    } else if (!usernamePattern.test(username)) {
      return 'Username cannot contain Special Character';
    }
    return '';
  };

  const validateBio = (bioText: string): string => {
    if (!bioText.trim()) {
      return 'Please enter your bio';
    }
    return '';
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    setUsernameError(validateUsername(value));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBio(value);
    setBioError(validateBio(value));
  };

  const validateInputs = () => {
    let isValid = true;

    setUsernameError('');
    setBioError('');
    setUrlButtonErrors([]);

    const usernameErrorMsg = validateUsername(userName);
    if (usernameErrorMsg) {
      setUsernameError(usernameErrorMsg);
      isValid = false;
    } else {
      setUsernameError('');
    }

    const bioErrorMsg = validateBio(bio);
    if (bioErrorMsg) {
      setBioError(bioErrorMsg);
      isValid = false;
    } else {
      setBioError('');
    }

    const isValidUrl = (url: string): boolean => {
      if (!url) {
        return false;
      }
      if (url === 'https://' || url.startsWith('https://https://')) {
        return false;
      }
      const urlPattern = /^(https?|ftp|ws):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$/;
      return urlPattern.test(url);
    };

    const updatedErrors = urlButtons.map((button: UrlButton) => ({
      id: button.id,
      title: button.title ? '' : 'Please enter button label',
      url: !button.url
        ? 'Please enter button URL'
        : isValidUrl(button.url)
        ? ''
        : 'Please enter a valid button URL',
    }));

    updatedErrors.forEach((error: UrlButtonErrors) => {
      if (error.title || error.url) {
        isValid = false;
      }
    });

    setUrlButtonErrors(updatedErrors);

    return isValid;
  };

  const handleNextButton = () => {
    if (validateInputs()) {
      setActiveStep(1);
    }
  };

  return (
    <Box>
      <Box className='text-xl font-bold text-gray-900 mb-1'>
        Compose Your Link List
      </Box>
      <Box className='text-base text-gray-500 font-medium mb-4'>
        Add the links you want to share and customize their titles
      </Box>
      <form className='flex flex-col gap-4' autoComplete='off' noValidate>
        <Box className='flex flex-col gap-2 mt-1'>
          <Label.Root
            htmlFor='username'
            className='text-gray-600 font-medium text-base mb-1'
          >
            Username
          </Label.Root>
          <input
            id='username'
            className={`rounded-lg bg-gray-100 border border-gray-300 px-3 h-12 w-full focus:outline-none focus:ring-1 focus:ring-gray-500 ${
              usernameError ? 'border-red-500' : ''
            }`}
            value={userName}
            onChange={handleUsernameChange}
            autoComplete='off'
            aria-multiline={true}
          />
          {usernameError && (
            <Box className='text-xs text-red-500 mt-1'>{usernameError}</Box>
          )}
        </Box>
        <Box className='flex flex-col gap-2'>
          <Label.Root
            htmlFor='bio'
            className='text-gray-600 font-medium text-base mb-1'
          >
            Bio
          </Label.Root>
          <textarea
            id='bio'
            className={`rounded-lg bg-gray-100 border border-gray-300 px-3 w-full hide-scrollbar focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none py-3 ${
              bioError ? 'border-red-500' : ''
            }`}
            value={bio}
            onChange={handleBioChange}
            rows={1}
            style={{ overflow: 'auto', minHeight: '88px' }}
            autoComplete='off'
          />
          {bioError && (
            <Box className='text-xs text-red-500 mt-1'>{bioError}</Box>
          )}
        </Box>
        <URLButtons
          urlButtons={urlButtons}
          setUrlButtons={setUrlButtons}
          urlButtonErrors={urlButtonErrors}
          setUrlButtonErrors={setUrlButtonErrors}
        />
        <button
          type='button'
          onClick={toggleOptionalField}
          className='mt-2 mx-auto font-bold border-0 flex items-center gap-1 bg-transparent cursor-pointer'
          style={{ fontSize: '16px' }}
        >
          See More
          <span>
            {showOptionalField ? (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 15l-7-7-7 7'
                />
              </svg>
            ) : (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            )}
          </span>
        </button>
        {showOptionalField && (
          <Box className='flex flex-col mt-2'>
            <Label.Root
              htmlFor='analytics-tag'
              className='flex justify-between mb-1'
            >
              <span className='font-medium text-gray-600 mb-1'>
                Google Analytics Tag
              </span>
              <span className='text-gray-400 mb-1'>Optional Field</span>
            </Label.Root>
            <textarea
              id='analytics-tag'
              className={`rounded-lg bg-gray-100 border border-gray-300 px-3 w-full hide-scrollbar focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none py-3`}
              value={analyticsTag}
              onChange={(e) => setAnalyticsTag(e.target.value)}
              rows={1}
              style={{ overflow: 'auto', minHeight: '88px' }}
              autoComplete='off'
            />
          </Box>
        )}
        <button
          type='button'
          className='bg-teal-500 text-white w-full mt-3 py-3 border-0 rounded-lg font-semibold hover:bg-teal-600 transition cursor-pointer'
          onClick={handleNextButton}
        >
          Next
        </button>
      </form>
    </Box>
  );
};

export default Form;
