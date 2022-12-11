import { useState, ReactElement } from 'react';

import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import {
  LoadMask,
  Well,
  FormWrapper,
  PageWrapper,
  SpacedTitle,
  EmailField,
  Button,
} from '@/src/components';

import { http } from '@/src/utils';

import {
  User,
  UpdateCtx,
  DefaultToastData,
  WellData,
} from '@/src/utils/interfaces';

import {
  EMAIL_INVALID_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

const resetPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
});

// TODO: submit loading spinner not tested!!!

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  if (!!user) {
    push('/dashboard');
    return <LoadMask />;
  }

  const handleResponse = (wellData: WellData) => {
    setIsLoading(false);
    setWellData(wellData);
  };

  interface ResProps {
    error: Error | undefined;
    ok: boolean | undefined;
  }

  const onSubmit = async (values: { email: string }): Promise<void> => {
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

    if (!!error) {
      handleResponse({ message: error.message });
    } else if (ok) {
      handleResponse({
        severity: 'success',
        message: `An email has been sent to ${email}. Please follow the steps to reset your password. Don't forget to check your junk folder.`,
      });
      setIsSubmitDisabled(true);
    }
  };

  return (
    <PageWrapper>
      <SpacedTitle>Reset Password</SpacedTitle>
      <FormWrapper onSubmit={handleSubmit((values) => onSubmit(values))}>
        {!!wellData ? <Well {...wellData} /> : null}
        <EmailField errors={errors} register={register} />
        <Button type='submit' disabled={isSubmitDisabled} isLoading={isLoading}>
          Submit
        </Button>
      </FormWrapper>
    </PageWrapper>
  );
}
