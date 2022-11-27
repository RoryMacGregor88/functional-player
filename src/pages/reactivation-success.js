import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Grid, Button, Typography } from '@mui/material';

import { LoadMask, PageWrapper, SpacedTitle } from '@/src/components';

import { syncSubscriptionStatus } from '@/src/utils';

import { REACTIVATION_SUCCESS_MESSAGE } from '@/src/utils/constants';

/**
 * @param {{
 *  user: object|null
 *  updateCtx: function
 * }} props
 */
export default function ReactivationSuccess({ user, updateCtx }) {
  const { push } = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  // TODO: need to stop this from activating if a user just comes here

  useEffect(() => {
    if (!!user) {
      (async () =>
        await syncSubscriptionStatus(user, updateCtx, setIsUpdated))();
    }
  }, [user, updateCtx]);

  if (!user) {
    push('/login');
    return <LoadMask />;
  }

  return !isUpdated ? (
    <LoadMask />
  ) : (
    <PageWrapper>
      <SpacedTitle>Success</SpacedTitle>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        gap={4}
      >
        <Typography variant='h4'>{REACTIVATION_SUCCESS_MESSAGE}</Typography>
        <Typography variant='body1'>
          Click the button below to return to your dashboard.
        </Typography>
        <Button onClick={() => push('/dashboard')}>
          Return to dashboard
        </Button>
      </Grid>
    </PageWrapper>
  );
}
