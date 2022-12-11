import { useState } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { LoginForm, SpacedTitle, Well, LoadMask } from '@/src/components';

import { http } from '@/src/utils';

import {
  User,
  UpdateCtx,
  WellData,
  DefaultToastData,
} from '@/src/utils/interfaces';

interface Props {
  user: User;
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

  interface ResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const onSubmit = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    setIsLoading(true);

    const { email, password } = values;

    const { error, resUser }: ResProps = await http({
      endpoint: '/auth/login',
      formData: {
        email: email.toLowerCase(),
        password,
      },
      onError: (defaultToastData: DefaultToastData) => {
        setIsLoading(false);
        updateCtx(defaultToastData);
      },
    });

    if (!!error) {
      setWellData({ message: error.message });
    } else if (!!resUser) {
      updateCtx({ user: resUser });
      push('/dashboard');
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
