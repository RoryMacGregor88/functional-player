import { useState, ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import {
  LoadMask,
  Well,
  PageWrapper,
  SpacedTitle,
  ResetPasswordForm,
} from '@/src/components';

import { http } from '@/src/utils';

import { PAGE_CANNOT_BE_ACCESSED_MESSAGE } from '@/src/utils/constants';

import {
  User,
  UpdateCtx,
  DefaultToastData,
  WellData,
} from '@/src/utils/interfaces';

interface Props {
  user: User;
  updateCtx: UpdateCtx;
}

export default function ResetPassword({
  user,
  updateCtx,
}: Props): ReactElement {
  const { push } = useRouter();
  const [wellData, setWellData] = useState<WellData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    if (user) {
      push('/dashboard');
      updateCtx({
        toastData: {
          severity: 'error',
          message: PAGE_CANNOT_BE_ACCESSED_MESSAGE,
        },
      });
    }
  }, [user, push, updateCtx]);

  if (user) return <LoadMask />;

  const handleResponse = (wellData: WellData) => {
    setIsLoading(false);
    setWellData(wellData);
  };

  interface ResProps {
    error: Error | undefined;
    ok: boolean | undefined;
  }

  const handleResetPassword = async (values: {
    email: string;
  }): Promise<void> => {
    setIsLoading(true);

    const { email } = values;

    const { error, ok }: ResProps = await http({
      endpoint: '/auth/reset-password',
      formData: {
        email: email.toLowerCase(),
      },
      onError: (defaultToastData: DefaultToastData) => {
        setIsLoading(false);
        updateCtx(defaultToastData);
      },
    });

    if (error) {
      const { message } = error;
      handleResponse({ message });
    } else if (ok) {
      handleResponse({
        severity: 'success',
        message: `An email has been sent to ${email}. Please follow the steps to reset your password. Don't forget to check your junk folder.`,
      });
      setIsSubmitDisabled(true);
    }
  };

  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Reset Password</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <ResetPasswordForm
        handleResetPassword={handleResetPassword}
        isSubmitDisabled={isSubmitDisabled}
        isLoading={isLoading}
      />
    </PageWrapper>
  );
}
