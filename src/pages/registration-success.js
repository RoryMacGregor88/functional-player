import { useRouter } from 'next/router';

import { Grid, Button, Typography } from '@mui/material';

import {
  LoadMask,
  SpacedTitle,
  PageWrapper,
  Attention,
  Stepper,
} from '@/src/components';

/** @param {{user: object|null}} props */
export default function RegistrationSuccess({ user }) {
  const router = useRouter();

  if (!!user) {
    router.push('/dashboard');
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
        <Button onClick={() => router.push('/login')}>Login</Button>
      </Grid>
    </PageWrapper>
  );
}
