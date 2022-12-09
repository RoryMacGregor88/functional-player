import { useState } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { LoginForm, SpacedTitle, Well, LoadMask } from '@/src/components';

import { http } from '@/src/utils';

import { User, UpdateCtx, WellData } from '@/src/utils/interfaces';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

interface Props {
  user: User | null;
  updateCtx: UpdateCtx;
}

export default function Login({ user, updateCtx }: Props) {
  const { push } = useRouter();

  const [wellData, setWellData] = useState<WellData>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!!user) {
    push('/dashboard');
    return <LoadMask />;
  }

  const onSubmit = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      const { error, resUser } = await http('/auth/login', {
        email: email.toLowerCase(),
        password,
      });

      if (!!error) {
        setWellData({ message: error.message });
      } else if (!!resUser) {
        updateCtx({ user: resUser });
        push('/dashboard');
      }
    } catch (e) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    }
    setIsLoading(false);
  };

  // TODO: no PageWrapper. Make consistent, check others
  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={{ maxWidth: '50rem' }}
    >
      <SpacedTitle>Login</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </Grid>
  );
}
