import { forwardRef, ReactElement, RefObject, ReactNode } from 'react';

import { IconButton as MuiIconButton, SxProps, Theme } from '@mui/material';

interface Props {
  onClick: Function;
  sx?: SxProps<Theme>;
  children: ReactNode;
  props?: any;
}

const IconButton = (
  { onClick, sx = {}, children, ...props },
  ref
): ReactElement => (
  <MuiIconButton
    ref={ref}
    onClick={onClick}
    disableRipple
    edge='start'
    color='inherit'
    sx={{ padding: '0', margin: '0', width: 'fit-content', ...sx }}
    {...props}
  >
    {children}
  </MuiIconButton>
);

export default forwardRef<RefObject<HTMLButtonElement>, Props>(IconButton);
