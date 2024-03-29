import { FC, ReactElement } from 'react';

import { Grid, Typography } from '@mui/material';

import { Button } from '@/src/components';

import { useCtx, formatDate } from '@/src/utils';

interface Props {
  handleLogoutFromAllClick: () => void;
}

const AccountDetails: FC<Props> = ({
  handleLogoutFromAllClick,
}): ReactElement => {
  const {
    ctx: { user },
  } = useCtx();

  const { email, username, creationDate, subscriptionStatus } = user;

  return (
    <Grid container alignItems='center' gap='1rem'>
      <Typography variant='h5'>Account summary:</Typography>
      <Grid item container direction='column' component='ul' gap='1rem'>
        <Grid item component='li'>
          Username: <strong>{username}</strong>
        </Grid>
        <Grid item component='li'>
          Email Address: <strong>{email}</strong>
        </Grid>
        <Grid item component='li'>
          Date Registered:{' '}
          <strong>
            {!!creationDate
              ? formatDate(creationDate)
              : 'Creation date not available.'}
          </strong>
        </Grid>
        <Grid item component='li'>
          Subscription Status: <strong>{subscriptionStatus}</strong>
        </Grid>
      </Grid>
      <Button onClick={handleLogoutFromAllClick}>
        Log out from all devices
      </Button>
    </Grid>
  );
};

export default AccountDetails;
