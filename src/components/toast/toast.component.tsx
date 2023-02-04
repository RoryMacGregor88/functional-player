import { FC, ReactElement } from 'react';

import {
  Snackbar,
  Fade,
  Alert,
  useMediaQuery,
  SnackbarOrigin,
} from '@mui/material';

import { IconButton, CloseIcon } from '@/src/components';

import { useCtx } from '@/src/utils';

import { Severity, UpdateCtx } from '@/src/utils/interfaces';

const Action: FC = (): ReactElement => {
  const { updateCtx } = useCtx();
  return (
    <IconButton onClick={() => updateCtx({ toastData: null })}>
      <CloseIcon
        data-testid='close-icon'
        sx={{ height: '1rem', width: '1rem' }}
      />
    </IconButton>
  );
};

interface ToastProps {
  open: boolean;
  message: string;
  updateCtx: UpdateCtx;
  severity?: Severity;
}

const Toast: FC<ToastProps> = ({
  open,
  message,
  updateCtx,
  severity = 'success',
}): ReactElement => {
  const isMedium = useMediaQuery('(max-width:1000px)');

  // TODO: Fade not working
  // also Action not working

  const AnchorOrigin: SnackbarOrigin = {
    vertical: isMedium ? 'bottom' : 'top',
    horizontal: isMedium ? 'center' : 'right',
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={() => updateCtx({ toastData: null })}
      anchorOrigin={AnchorOrigin}
      TransitionComponent={Fade}
      action={<Action />}
      sx={{ zIndex: 4000 }}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default Toast;
