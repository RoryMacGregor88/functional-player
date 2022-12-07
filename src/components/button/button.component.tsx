import { ReactElement, forwardRef, RefObject, ReactNode } from 'react';

import { Button as MuiButton } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

interface Props {
  onClick?: Function;
  disabled?: boolean;
  isLoading?: boolean;
  type?: string;
  children: ReactNode;
  props?: any;
}

// TODO: get rid of ...props? Being used anywhere?

const Button = (
  { onClick, disabled = false, isLoading = false, children, type, ...props },
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
      color: 'background.paper',
    }}
    {...props}
  >
    {isLoading ? (
      <LoadingSpinner
        data-testid='loading-spinner'
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
