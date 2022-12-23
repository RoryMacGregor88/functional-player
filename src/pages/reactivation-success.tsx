import { useState, useEffect, ReactElement } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';

import { Grid, Button, Typography } from '@mui/material';

import { LoadMask, PageWrapper, SpacedTitle } from '@/src/components';

import { syncSubscriptionStatus } from '@/src/utils';

import { REACTIVATION_SUCCESS_MESSAGE } from '@/src/utils/constants';

import { UpdateCtx, User } from '@/src/utils/interfaces';

interface ServerSideProps {
  props: { redirect: boolean };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // Checks if the page was redirected to from the accounts page,
  // preventing manual linking to this page.
  const redirect = !!ctx.query.redirect;
  return {
    props: { redirect },
  };
};

interface Props {
  user: User;
  updateCtx: UpdateCtx;
  redirect: boolean;
}

export default function ReactivationSuccess({
  user,
  updateCtx,
  redirect,
}: Props): ReactElement {
  const { push } = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  type ResProps = boolean | undefined;

  useEffect(() => {
    if (!redirect) {
      push('/dashboard');
    } else if (!!redirect) {
      (async () => {
        const res: ResProps = await syncSubscriptionStatus({
          user,
          updateCtx,
        });
        if (!!res) setIsUpdated(true);
      })();
    }
  }, [user, updateCtx, redirect, push]);

  if (!redirect) return <LoadMask />;

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
        <Button onClick={() => push('/dashboard')}>Return to dashboard</Button>
      </Grid>
    </PageWrapper>
  );
}
