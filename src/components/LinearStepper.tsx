import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';

const steps = ['1', '2', '3'];
const styles = {
  stepperBox: {
    width: '100%',
    mx: 'auto',
  },
  stepLabel: {
    '& .MuiStepIcon-root': {
      height: '30px',
      width: '30px',
      color: '#EFF0F6',
      '&.Mui-completed': {
        color: 'secondary.main',
      },
      '&.Mui-active': {
        color: 'secondary.main',
      },
    },
  },
};
export default function LinearStepper({ activeStep }: { activeStep: number }) {
  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 13,
      left: 'calc(-50% + 24px)',
      right: 'calc(50% + 24px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#1AB4A3',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#1AB4A3',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#EFF0F6',
      borderTopWidth: 3,
      borderRadius: '32px',
      borderWidth: '4.83px',
      ...theme.applyStyles('dark', {
        borderColor: theme.palette.grey[800],
      }),
    },
  }));

  return (
    <Box sx={styles.stepperBox}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
        sx={{
          padding: 0,
        }}
      >
        {steps.map((label, index) => (
          <Step key={label} sx={{ flexGrow: 1, flexBasis: 0 }}>
            <StepLabel
              sx={{
                ...styles.stepLabel,
                '& .MuiStepIcon-text': {
                  fill: activeStep === index ? 'primary.main' : '#6F6C90',
                  fontSize: '12.89px',
                  fontWeight: 'bold',
                },
              }}
            />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
