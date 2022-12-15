import { FC, ReactElement } from 'react';

import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Button, CloseIcon } from '@/src/components';

import { DialogAction, UpdateCtx } from '@/src/utils/interfaces';

interface Props {
  open: boolean;
  updateCtx: UpdateCtx;
  title: string;
  message: string;
  actions: DialogAction[];
}

const Dialog: FC<Props> = ({
  open,
  updateCtx,
  title,
  message,
  actions,
}): ReactElement => {
  const close = () => updateCtx({ dialogData: null });
  return (
    <MuiDialog
      open={open}
      onClose={close}
      aria-labelledby={title}
      aria-describedby={title}
      sx={{
        zIndex: 4000,
        '.MuiDialog-paper': {
          justifyContent: 'space-evenly',
          alignItems: 'center',
        },
      }}
    >
      <CloseIcon
        onClick={close}
        sx={{ margin: '0.5rem 0.5rem 0 auto', cursor: 'pointer' }}
        data-testid='close-icon'
      />
      {!!title ? (
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      ) : null}
      <DialogContent>{message}</DialogContent>
      {!!actions ? (
        <DialogActions
          disableSpacing
          sx={{
            width: '100%',
            padding: '0.5rem 1rem',
            gap: '1rem',
          }}
        >
          {actions.map(({ label, onClick, closeOnClick }) => (
            <Button
              key={label}
              onClick={() => {
                onClick();
                if (closeOnClick) close();
              }}
            >
              {label}
            </Button>
          ))}
        </DialogActions>
      ) : null}
    </MuiDialog>
  );
};

export default Dialog;
