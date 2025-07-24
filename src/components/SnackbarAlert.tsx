import { Alert, Snackbar } from '@mui/material';

export interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number;
  onClose: () => void;
}

export const SnackbarAlert = ({
  open,
  message,
  severity = 'info',
  autoHideDuration = 2000,
  onClose,
}: SnackbarAlertProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
