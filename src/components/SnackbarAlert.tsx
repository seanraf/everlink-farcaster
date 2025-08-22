import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';

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
  React.useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  const severityStyles: Record<string, string> = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <Toast.Provider swipeDirection='down'>
      <Toast.Root
        open={open}
        onOpenChange={(v) => !v && onClose()}
        style={{
          position: 'fixed',
          left: '50%',
          bottom: '3rem',
          transform: 'translateX(-50%)',
        }}
        className={`fixed bottom-12 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${severityStyles[severity]}`}
      >
        <span className='flex-1'>{message}</span>
      </Toast.Root>
      <Toast.Viewport className='fixed bottom-0 flex flex-col p-4 gap-2 w-full max-w-full z-50' />
    </Toast.Provider>
  );
};
