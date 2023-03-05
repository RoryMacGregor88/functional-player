import { useState, useEffect, ReactElement } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';

import { Grid, Button, Typography } from '@mui/material';

import { LoadMask, PageWrapper, SpacedTitle } from '@/src/components';

import { syncSubscriptionStatus, logout } from '@/src/utils';

import {
  REACTIVATION_SUCCESS_MESSAGE,
  PAGE_CANNOT_BE_ACCESSED_MESSAGE,
} from '@/src/utils/constants';

import { UpdateCtx, User } from '@/src/utils/interfaces';

interface ServerSideProps {
  props: { hasPaymentIntent: boolean };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // Checks if the page was redirected to from the accounts page,
  // preventing manual linking to this page.
  const hasPaymentIntent = !!ctx.query.payment_intent;
  return {
    props: { hasPaymentIntent },
  };
};

interface Props {
  user: User;
  updateCtx: UpdateCtx;
  hasPaymentIntent: boolean;
}

export default function ReactivationSuccess({
  user,
  updateCtx,
  hasPaymentIntent,
}: Props): ReactElement {
  const { push } = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    // TODO: is this stuff tested?
    if (!hasPaymentIntent) {
      updateCtx({
        toastData: {
          severity: 'error',
          message: PAGE_CANNOT_BE_ACCESSED_MESSAGE,
        },
      });
      push('/dashboard');
    } else if (!!hasPaymentIntent) {
      (async () => {
        const { ok } = await syncSubscriptionStatus({
          user,
          updateCtx,
        });

        if (ok) {
          setIsUpdated(true);
        } else if (!ok) {
          await logout({ user, updateCtx, push });
        }
      })();
    }
  }, [user, updateCtx, hasPaymentIntent, push]);

  if (!hasPaymentIntent || !isUpdated) return <LoadMask />;

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
