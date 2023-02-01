import { FC, ReactElement } from 'react';

import Logo from '@/src/fp-logo.png';

import Image from 'next/image';

import { Backdrop, Box, useMediaQuery } from '@mui/material';

import { LoadingSpinner } from '@/src/components';

import { THEME_COLORS } from '@/src/utils/constants';

// TODO: replace loading spinner with real logo SVG

interface Props {
  showLogo?: boolean;
}

const LoadMask: FC<Props> = ({ showLogo = false }): ReactElement => {
  const isMobile = useMediaQuery('(max-width:700px)'),
    spinnerStyles = {
      sx: {
        height: isMobile ? '2rem !important' : '2rem !important',
        width: isMobile ? '2rem !important' : '2rem !important',
      },
    };
  return (
    <Backdrop
      open
      // Background color is not from theme because spinner
      // in _app.tsx is outside ThemeProvider
      sx={{ backgroundColor: THEME_COLORS.darkBlack, zIndex: '1000' }}
    >
      {showLogo ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: isMobile ? '10rem' : '15rem',
          }}
        >
          <Image
            alt='fp-logo'
            src={Logo}
            style={{ height: 'inherit', width: 'inherit' }}
          />
          <LoadingSpinner {...spinnerStyles} />
        </Box>
      ) : (
        <LoadingSpinner {...spinnerStyles} />
      )}
    </Backdrop>
  );
};

export default LoadMask;
