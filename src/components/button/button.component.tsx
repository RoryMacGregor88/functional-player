import { ReactElement, forwardRef, RefObject } from 'react';

import { Button as MuiButton } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

interface Props {
  onClick: Function;
  disabled?: boolean;
  isLoading?: boolean;
  children: ReactElement | string;
  props?: any;
}

const Button = (
  { onClick, disabled = false, isLoading = false, children, ...props },
  ref
): ReactElement => (
  <MuiButton
    ref={ref}
    sx={{
      margin: '0.5rem 0',
      padding: '0.5rem 0',
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'primary.main',
      color: 'background.paper',
    }}
    onClick={onClick}
    disabled={disabled || isLoading}
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
