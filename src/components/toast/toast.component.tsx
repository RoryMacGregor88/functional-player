import { FC, ReactElement, useContext } from 'react';

import {
  Snackbar,
  Fade,
  Alert,
  useMediaQuery,
  SnackbarOrigin,
} from '@mui/material';

import { IconButton, CloseIcon } from '@/src/components';

import { Context } from '@/src/utils';

import { Severity, UpdateCtx } from '@/src/utils/interfaces';

const Action: FC = (): ReactElement => {
  const { updateCtx } = useContext(Context);
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
  // TODO: Action not working

  const anchorOrigin: SnackbarOrigin = {
    vertical: isMedium ? 'bottom' : 'top',
    horizontal: isMedium ? 'center' : 'right',
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => updateCtx({ toastData: null })}
      anchorOrigin={anchorOrigin}
      TransitionComponent={Fade}
      action={<Action />}
      sx={{ zIndex: 4000 }}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default Toast;
