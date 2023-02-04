import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

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

import { SUCCESSFUL_LOG_IN_MESSAGE } from '@/src/utils/constants';

interface Props {
  user: User;
  updateCtx: UpdateCtx;
}

export default function Login({ user, updateCtx }: Props) {
  const { push } = useRouter();

  const [wellData, setWellData] = useState<WellData>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!user) {
      push('/dashboard');
    }
  }, [user, push]);

  if (!!user) return <LoadMask />;

  interface ResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const handleLogin = async (formValues: LoginFormValues): Promise<void> => {
    // TODO: do this for all handlers that need it
    // remove well between requests, like if password is wrong
    // and they have to submit again
    setWellData(null);
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
      updateCtx({
        user: resUser,
        toastData: {
          message: SUCCESSFUL_LOG_IN_MESSAGE,
        },
      });
      push('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Login</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <LoginForm handleLogin={handleLogin} isLoading={isLoading} />
    </PageWrapper>
  );
}
