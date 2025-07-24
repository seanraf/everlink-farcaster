import React, { useEffect, useState } from 'react';
import URLButtons from './URLButtons';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import { useAuth } from '@crossmint/client-sdk-react-ui';
import { useFrameContext } from '../providers/FarcasterContextProvider';
import type { UrlButton, UrlButtonErrors } from '../types';

const styles = {
  composeLinkList: {
    fontSize: { sm: '19.33px', xs: '16px' },
    fontWeight: 'bold',
    color: 'text.primary',
  },
  tagline: {
    fontSize: { sm: 16, xs: 13 },
    color: 'secondary.contrastText',
    fontWeight: 500,
  },
  textFieldsBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  textFieldsLabel: {
    color: 'text.secondary',
    mt: 2,
    fontWeight: 500,
    fontSize: { md: 16, xs: 14 },
  },
  textFields: {
    mt: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#F8F8F8',
      '& fieldset': {
        borderColor: '#CBD2E0',
        borderRadius: '8px',
      },
      '&:hover fieldset': {
        borderColor: '#CBD2E0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#CBD2E0',
      },
    },
  },
  seeMoreButton: {
    mt: 2,
    mx: 'auto',
    fontWeight: 'bold',
    color: 'text.secondary',
  },
  dropDownIcon: {
    height: 30,
    width: 30,
    ml: -1,
  },
  analyticsTagBox: {
    mt: 2,
    flexDirection: 'column',
    '& .MuiTypography-root': {
      fontSize: { md: 16, xs: 14 },
    },
  },
  analyticsTagLabel: { display: 'flex', justifyContent: 'space-between' },
  nextButton: {
    bgcolor: 'secondary.main',
    color: 'primary.contrastText',
    width: '100%',
    mt: 3,
  },
};
const From = ({
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

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Typography sx={styles.composeLinkList}>
        Compose Your Link List
      </Typography>
      <Typography sx={styles.tagline}>
        Add the links you want to share and customize their titles
      </Typography>
      <Box
        component='form'
        sx={styles.textFieldsBox}
        noValidate
        autoComplete='off'
      >
        <Box sx={{ ...styles.textFieldsBox, mt: 1 }}>
          <InputLabel
            htmlFor='input-with-icon-adornment'
            sx={styles.textFieldsLabel}
          >
            Username
          </InputLabel>
          <TextField
            InputProps={{
              inputProps: {
                style: {
                  padding: '0 10px',
                  height: '48px',
                  width: '100%',
                  backgroundColor: '#F8F8F8',
                },
              },
            }}
            sx={styles.textFields}
            fullWidth
            id='outlined-basic'
            variant='outlined'
            value={userName}
            onChange={handleUsernameChange}
            error={!!usernameError}
            helperText={usernameError}
          />
        </Box>
        <Box sx={styles.textFieldsBox}>
          <InputLabel
            htmlFor='input-with-icon-adornment'
            sx={styles.textFieldsLabel}
          >
            Bio
          </InputLabel>
          <TextField
            InputProps={{
              inputProps: {
                style: {
                  height: '48px',
                  width: '100%',
                  backgroundColor: '#F8F8F8',
                },
              },
            }}
            sx={styles.textFields}
            fullWidth
            multiline
            rows={2}
            id='outlined-basic'
            variant='outlined'
            value={bio}
            onChange={handleBioChange}
            error={!!bioError}
            helperText={bioError}
          />
        </Box>
        <URLButtons
          urlButtons={urlButtons}
          setUrlButtons={setUrlButtons}
          urlButtonErrors={urlButtonErrors}
          setUrlButtonErrors={setUrlButtonErrors}
        />
        <Button
          onClick={toggleOptionalField}
          sx={styles.seeMoreButton}
          endIcon={
            showOptionalField ? (
              <ArrowDropUpIcon sx={styles.dropDownIcon} />
            ) : (
              <ArrowDropDownIcon sx={styles.dropDownIcon} />
            )
          }
        >
          See More
        </Button>
        {showOptionalField && (
          <Box sx={styles.analyticsTagBox}>
            <InputLabel htmlFor='optional-field' sx={styles.analyticsTagLabel}>
              <Typography>Google Analytics Tag</Typography>
              <Typography color='secondary.contrastText'>
                Optional Field
              </Typography>
            </InputLabel>
            <TextField
              InputProps={{
                inputProps: {
                  style: {
                    padding: '3px 5px',
                    width: '100%',
                    backgroundColor: '#F8F8F8',
                  },
                },
              }}
              sx={styles.textFields}
              fullWidth
              id='optional-field'
              variant='outlined'
              multiline
              rows={3}
              value={analyticsTag}
              onChange={(e) => setAnalyticsTag(e.target.value)}
            />
          </Box>
        )}
        <Button sx={styles.nextButton} onClick={handleNextButton}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default From;
