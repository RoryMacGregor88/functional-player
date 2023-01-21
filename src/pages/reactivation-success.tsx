import { useState, useEffect, ReactElement } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';

import { Grid, Button, Typography } from '@mui/material';

import { LoadMask, PageWrapper, SpacedTitle } from '@/src/components';

import { syncSubscriptionStatus } from '@/src/utils';

import { REACTIVATION_SUCCESS_MESSAGE } from '@/src/utils/constants';

import { UpdateCtx, User } from '@/src/utils/interfaces';

interface ServerSideProps {
  props: { paymentIntent: boolean };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // Checks if the page was redirected to from the accounts page,
  // preventing manual linking to this page.
  const paymentIntent = !!ctx.query.payment_intent;
  return {
    props: { paymentIntent },
  };
};

interface Props {
  user: User;
  updateCtx: UpdateCtx;
  paymentIntent: boolean;
}

export default function ReactivationSuccess({
  user,
  updateCtx,
  paymentIntent,
}: Props): ReactElement {
  const { push } = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!paymentIntent) {
      push('/dashboard');
    } else if (!!paymentIntent) {
      (async () => {
        const { ok } = await syncSubscriptionStatus({
          user,
          updateCtx,
        });
        if (ok) setIsUpdated(true);
      })();
    }
  }, [user, updateCtx, paymentIntent, push]);

  if (!paymentIntent || !isUpdated) return <LoadMask />;

  return (
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
        <Button onClick={() => push('/dashboard')}>Return to dashboard</Button>
      </Grid>
    </PageWrapper>
  );
}
