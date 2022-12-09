import { FC, ReactElement } from 'react';

import { Alert, AlertTitle } from '@mui/material';

import { WellData } from '@/src/utils/interfaces';

const Well: FC<WellData> = ({
  title = null,
  message,
  severity = 'error',
}): ReactElement => {
  const defaultTitle = severity === 'error' ? 'Error!' : 'Success!';
  return (
    <Alert
      severity={severity}
      sx={{ width: '100%', padding: '1rem', marginBottom: '2rem' }}
    >
      <AlertTitle>{title ?? defaultTitle}</AlertTitle>
      {message}
    </Alert>
  );
};

export default Well;
