import { useState, FC, ReactElement } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { Typography, Grid } from '@mui/material';

import { FormWrapper, Button, PasswordField } from '@/src/components';

import { PASSWORD_REQUIRED_MESSAGE } from '@/src/utils/constants';

import { DeleteFormValues } from '@/src/utils/interfaces';

const deleteFormSchema = Yup.object().shape({
  password: Yup.string().required(PASSWORD_REQUIRED_MESSAGE),
});

interface Props {
  handleDelete: (formValues: DeleteFormValues) => void;
  isLoading: boolean;
}

const DeleteAccountForm: FC<Props> = ({
  handleDelete,
  isLoading,
}): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(deleteFormSchema),
    defaultValues: {
      password: '',
    },
  });

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const isDisabled = !isDirty || !!Object.keys(errors).length;

  return (
    <FormWrapper
      onSubmit={handleSubmit((formValues) => {
        setShowConfirmButton(false);
        handleDelete(formValues);
      })}
    >
      <Typography sx={{ textAlign: 'center' }}>
        Re-enter password to proceed
      </Typography>
      <PasswordField
        error={errors.password}
        register={register}
        label='Password'
        name='password'
      />
      <Button onClick={() => setShowConfirmButton(true)} disabled={isDisabled}>
        Proceed
      </Button>
      {showConfirmButton ? (
        <Grid
          item
          container
          direction='column'
          alignItems='center'
          sx={{
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'error.dark',
            borderRadius: 1,
            padding: '1rem',
          }}
        >
          <Typography
            variant='h5'
            sx={{
              color: 'error.dark',
              paddingBottom: '0.5rem',
            }}
          >
            WARNING
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: 'common.white',
              paddingBottom: '0.5rem',
            }}
          >
            This action is irreversible, are you sure?
          </Typography>
          <Button
            type='submit'
            isLoading={isLoading}
            sx={{
              backgroundColor: 'error.dark',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'error.dark',
                opacity: '0.75',
              },
            }}
          >
            Yes, permanently delete my account
          </Button>
        </Grid>
      ) : null}
    </FormWrapper>
  );
};

export default DeleteAccountForm;
