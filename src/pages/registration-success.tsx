import { ReactElement } from 'react';

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

import { User } from '@/src/utils/interfaces';

interface ServerSideProps {
  props: { redirect: boolean };
}

export const getServerSideProps: GetServerSideProps = async (
  ctx
): Promise<ServerSideProps> => {
  // Checks if the page was redirected to from the registration page,
  // preventing manual linking to this page.
  const redirect = !!ctx.query.redirect;
  return {
    props: { redirect },
  };
};

interface Props {
  user: User | null;
  redirect: boolean;
}

export default function RegistrationSuccess({
  user,
  redirect,
}: Props): ReactElement {
  const { push } = useRouter();

  // TODO: need to check if a user? Really only redirect we care about
  if (!!user || !redirect) {
    push('/dashboard');
    return <LoadMask />;
  }

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
