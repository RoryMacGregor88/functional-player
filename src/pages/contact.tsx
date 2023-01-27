import { ReactElement, useState } from 'react';

import { useForm } from 'react-hook-form';

import { Typography } from '@mui/material';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import {
  PageWrapper,
  FormWrapper,
  SpacedTitle,
  EmailField,
  TextField,
  Button,
  Well,
} from '@/src/components';

import { http } from '@/src/utils';

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  BODY_REQUIRED_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from '@/src/utils/constants';

import { DefaultToastData, ContactFormValues } from '@/src/utils/interfaces';

const contactFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  body: Yup.string().required(BODY_REQUIRED_MESSAGE),
});

export default function Contact({ updateCtx }): ReactElement {
  const [wellData, setWellData] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(contactFormSchema),
    defaultValues: {
      email: '',
      body: '',
    },
  });

  interface ResProps {
    ok: boolean | null;
    error: Error | undefined;
  }

  const onSubmit = async ({ email, body }: ContactFormValues) => {
    setIsLoading(true);

    const { ok, error }: ResProps = await http({
      endpoint: '/contact',
      formData: {
        email,
        body,
      },
      onError: (DefaultToastData: DefaultToastData) => {
        setIsLoading(false);
        updateCtx(DefaultToastData);
      },
    });

    if (!!error) {
      setWellData({ message: DEFAULT_ERROR_MESSAGE });
    } else if (ok) {
      setWellData({
        severity: 'success',
        message: 'Your message has been successfully sent.',
      });
      setIsSubmitDisabled(true);
    }
    setIsLoading(false);
  };

  const isDisabled =
    isSubmitDisabled || !isDirty || !!Object.keys(errors).length;

  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Contact</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <Typography
        variant='body1'
        sx={{ padding: '1rem', textAlign: 'center', fontSize: '1rem' }}
      >
        Please leave your email address and message below. We aim to respond
        within 24 hours.
      </Typography>
      <FormWrapper
        onSubmit={handleSubmit((formValues) => onSubmit(formValues))}
      >
        <EmailField error={errors.email} register={register} />
        <TextField
          id='body'
          textArea={true}
          label='Type here...'
          error={errors.body}
          register={register}
        />
        <Button type='submit' isLoading={isLoading} disabled={isDisabled}>
          Submit
        </Button>
      </FormWrapper>
    </PageWrapper>
  );
}
