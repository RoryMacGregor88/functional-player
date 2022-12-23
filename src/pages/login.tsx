import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import {
  LoginForm,
  SpacedTitle,
  Well,
  LoadMask,
  PageWrapper,
} from '@/src/components';

import { http } from '@/src/utils';

import {
  User,
  UpdateCtx,
  WellData,
  DefaultToastData,
  LoginFormValues,
} from '@/src/utils/interfaces';

interface Props {
  user: User;
  updateCtx: UpdateCtx;
}

export default function Login({ user, updateCtx }: Props) {
  const { push } = useRouter();

  const [wellData, setWellData] = useState<WellData>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!user) push('/dashboard');
  }, [user, push]);

  if (!!user) return <LoadMask />;

  interface ResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const handleLogin = async (formValues: LoginFormValues): Promise<void> => {
    setIsLoading(true);

    const { email, password } = formValues;

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

  return (
    <PageWrapper>
      <Grid
        container
        direction='column'
        alignItems='center'
        sx={{ maxWidth: '50rem', margin: '5rem auto' }}
      >
        <SpacedTitle>Login</SpacedTitle>
        {!!wellData ? <Well {...wellData} /> : null}
        <LoginForm handleLogin={handleLogin} isLoading={isLoading} />
      </Grid>
    </PageWrapper>
  );
}
