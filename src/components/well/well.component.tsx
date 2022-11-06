import { FC, ReactElement } from 'react';
import { Alert, AlertTitle, AlertColor } from '@mui/material';

interface Props {
  title?: string | null;
  message: string;
  severity?: AlertColor;
}

const Well: FC<Props> = ({
  title = null,
  message,
  severity = 'error',
}): ReactElement => {
  const defaultTitle: string = severity === 'error' ? 'Error!' : 'Success!';
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
