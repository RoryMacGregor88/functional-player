import { Grid, Typography } from '@mui/material';

import { PageWrapper, SpacedTitle, LinkButton, Link } from '@/src/components';

import { SESSION_EXPIRY_LENGTH } from '@/src/utils/constants';

export default function Privacy({ user }) {
  const bodyStyles = { textAlign: 'center' };
  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Privacy Policy</SpacedTitle>
      <Grid container direction='column' alignItems='center' gap='1rem'>
        <Typography variant='body1' sx={bodyStyles}>
          FunctionalPlayer&copy; does not, and will never, track or sell any of
          your personal data. We use a single secure session cookie that is
          stored on your browser, so that we remember who you are when you next
          return to the app. This cookie expires in {SESSION_EXPIRY_LENGTH} days
          by default, and can be removed at any time by either clearing your
          browser&apos;s cookies, or clicking the &apos;Log out from all
          devices&apos; button located in the accounts section.
        </Typography>
        {!!user ? (
          <Link href='/account'>
            <LinkButton noLeftMargin>Go to your account</LinkButton>
          </Link>
        ) : null}
        <Typography variant='body1' sx={bodyStyles}>
          All passwords are fully encrypted, salted (mixed with
          randomly-generated characters) and stored in a secure database hosted
          by one of the most trusted storage providers in the world.
        </Typography>
      </Grid>
    </PageWrapper>
  );
}
