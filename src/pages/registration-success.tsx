import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps } from 'next';

import { Grid, Button, Typography } from '@mui/material';

import {
  LoadMask,
  SpacedTitle,
  PageWrapper,
  Attention,
  Stepper,
} from '@/src/components';

import { UpdateCtx } from '@/src/utils/interfaces';

import { PAGE_CANNOT_BE_ACCESSED_MESSAGE } from '@/src/utils/constants';

interface ServerSideProps {
  props: { hasPaymentIntent: boolean };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // Checks if the page was redirected to from the registration page,
  // preventing manual linking to this page.
  const hasPaymentIntent = !!ctx.query.payment_intent;
  return {
    props: { hasPaymentIntent },
  };
};

interface Props {
  updateCtx: UpdateCtx;
  hasPaymentIntent: boolean;
}

export default function RegistrationSuccess({
  updateCtx,
  hasPaymentIntent,
}: Props): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    if (!hasPaymentIntent) {
      push('/dashboard');
      updateCtx({
        toastData: {
          severity: 'error',
          message: PAGE_CANNOT_BE_ACCESSED_MESSAGE,
        },
      });
    }
  }, [hasPaymentIntent, push, updateCtx]);

  if (!hasPaymentIntent) return <LoadMask />;

  return (
    <PageWrapper>
      <SpacedTitle>Success</SpacedTitle>
      <Stepper activeStep={3} />
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        gap={4}
      >
        <Typography variant='h4'>
          Thank you, your subscription was successful.
        </Typography>
        <Typography variant='body1'>
          You can access your account information by clicking the{' '}
          <Attention>My Account</Attention> tab in the sidebar.
        </Typography>
        <Typography variant='body1'>
          Click the button below to login.
        </Typography>
        <Button onClick={() => push('/login')}>Login</Button>
      </Grid>
    </PageWrapper>
  );
}
