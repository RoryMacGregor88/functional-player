import { ReactElement, forwardRef, RefObject, ReactNode } from 'react';

import { Button as MuiButton, SxProps, Theme } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

interface Props {
  onClick?: Function;
  disabled?: boolean;
  isLoading?: boolean;
  type?: string;
  sx?: SxProps<Theme>;
  children: ReactNode;
  props?: any;
}

// TODO: get rid of ...props? Being used anywhere?
// also, need disabled color to make clear that it's disabled

const Button = (
  {
    onClick,
    disabled = false,
    isLoading = false,
    sx,
    children,
    type,
    ...props
  },
  ref
): ReactElement => (
  <MuiButton
    ref={ref}
    onClick={onClick}
    type={type}
    disabled={disabled || isLoading}
    sx={{
      margin: '0.5rem 0',
      padding: '0.5rem 0',
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'primary.main',
      color: 'common.black',
      '&:disabled': {
        color: 'common.black',
        opacity: '0.5',
        // TODO: why this not working?
        cursor: 'not-allowed',
      },
      '&:hover': {
        backgroundColor: 'primary.main',
        opacity: '0.75',
      },
      ...sx,
    }}
    {...props}
  >
    {isLoading ? (
      <LoadingSpinner
        sx={{
          width: '1.5rem !important',
          height: '1.5rem !important',
          alignSelf: 'center',
          color: 'background.paper',
        }}
      />
    ) : (
      children
    )}
  </MuiButton>
);

export default forwardRef<RefObject<HTMLButtonElement>, Props>(Button);
