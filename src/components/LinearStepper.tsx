import * as React from 'react';
import { Box } from './Box';

const steps = ['1', '2', '3'];

const styles = {
  stepperBox: {
    margin: '0 auto',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    marginBottom: '8px',
  },
  step: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    width: '40px',
  },
  stepIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12.89px',
    fontWeight: 'bold',
    border: '3px solid',
    marginBottom: 'auto',
    backgroundColor: 'red',
  },
  stepIconActive: {
    backgroundColor: '#1AB4A3',
    borderColor: '#1AB4A3',
    color: 'white',
  },
  stepIconCompleted: {
    backgroundColor: '#1AB4A3',
    borderColor: '#1AB4A3',
    color: 'white',
  },
  stepIconInactive: {
    backgroundColor: 'transparent',
    borderColor: '#EFF0F6',
    color: '#6F6C90',
  },
  connector: {
    flex: 1,
    height: '4.83px',
    backgroundColor: '#EFF0F6',
    borderRadius: '32px',
    margin: '0 4px',
  },
  connectorActive: {
    backgroundColor: '#1AB4A3',
  },
  connectorCompleted: {
    backgroundColor: '#1AB4A3',
  },
};

export default function LinearStepper({ activeStep }: { activeStep: number }) {
  const getStepIconStyle = (index: number) => {
    if (index < activeStep) {
      return { ...styles.stepIcon, ...styles.stepIconCompleted };
    } else if (index === activeStep) {
      return { ...styles.stepIcon, ...styles.stepIconActive };
    } else {
      return { ...styles.stepIcon, ...styles.stepIconInactive };
    }
  };

  const getConnectorStyle = (index: number) => {
    if (index < activeStep) {
      return { ...styles.connector, ...styles.connectorCompleted };
    } else if (index === activeStep) {
      return { ...styles.connector, ...styles.connectorActive };
    } else {
      return styles.connector;
    }
  };

  return (
    <Box style={styles.stepperBox} className='md:w-4/5'>
      <Box style={styles.stepperContainer}>
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <Box style={styles.step}>
              <Box style={getStepIconStyle(index)}>
                {label}
              </Box>
            </Box>
            {index < steps.length - 1 && (
              <Box style={getConnectorStyle(index)} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
