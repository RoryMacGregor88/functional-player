import { useState, ReactElement, FC, ReactNode, useEffect } from 'react';

import { useRouter } from 'next/router';

import { StripeError } from '@stripe/stripe-js';

import { Tabs, Tab, Box } from '@mui/material';

import {
  SpacedTitle,
  UpdatePasswordForm,
  DeleteAccountForm,
  UpdateSubscriptionForm,
  Well,
  LoadMask,
  PageWrapper,
} from '@/src/components';

import {
  DEFAULT_ERROR_MESSAGE,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
  ACCOUNT_DELETE_SUCCESS_MESSAGE,
  CANCEL_SUBSCRITION_SUCCESS_MESSAGE,
  LOGIN_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import {
  User,
  UpdateCtx,
  WellData,
  DefaultToastData,
  UpdatePasswordFormValues,
  DeleteFormValues,
  ResubscribeFormValues,
  Ctx,
} from '@/src/utils/interfaces';

import { http } from '@/src/utils';

//TODO: need `Account Details` page, read-only
// also, need `Are you sure?` step for cancelling subscription

interface TabPanelProps {
  name: string;
  value: number;
  index: number;
  children: ReactNode;
}

const TabPanel: FC<TabPanelProps> = ({
  name,
  value,
  index,
  children,
}): ReactElement => (
  <Box
    role='tabpanel'
    hidden={value !== index}
    id={`${name}-tab`}
    aria-labelledby={`${name}-tab`}
    sx={{ width: '100%' }}
  >
    {value === index ? children : null}
  </Box>
);

interface Props {
  user: User;
  ctx: Ctx;
  updateCtx: UpdateCtx;
}

export default function Account({ user, ctx, updateCtx }: Props): ReactElement {
  const { push } = useRouter();

  const [value, setValue] = useState(0);
  const [wellData, setWellData] = useState<WellData>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      push('/login');

      // TODO: does this happen anywhere else? Surely it happens in every restricted page?
      // this is here because we need to conditionally call updateCtx here,
      // as the toast message here "Must be logged in..." will override the
      // toast message from logging out "Sucessfully logged out" if the user
      // logs out from this page.
      //
      // so it's saying "If there isn't already toast data saying 'successfully
      // logged out', show toast data for 'you must be logged in..'"
      if (!ctx.toastData) {
        updateCtx({
          toastData: {
            severity: 'error',
            message: LOGIN_REQUIRED_MESSAGE,
          },
        });
      }
    }
  }, [user, push, ctx, updateCtx]);

  if (!user) return <LoadMask />;

  const { subscriptionStatus } = user;

  const handleSuccess = (message: string) => {
    setIsLoading(false);
    setWellData({
      severity: 'success',
      message,
    });
  };

  const handleServerError = (error?: { message: string }) => {
    setIsLoading(false);
    setWellData({ message: error?.message ?? DEFAULT_ERROR_MESSAGE });
  };

  const handleClientError = (defaultToastData: DefaultToastData) => {
    setIsLoading(false);
    updateCtx(defaultToastData);
  };

  const handleTabChange = (_: any, newValue: number) => {
    if (!!wellData) setWellData(null);
    setValue(newValue);
  };

  interface UpdatePasswordResProps {
    error: Error | undefined;
    ok: boolean | undefined;
  }

  const handleUpdatePassword = async (formValues: UpdatePasswordFormValues) => {
    setIsLoading(true);

    const { email } = user;
    const { currentPassword, newPassword } = formValues;

    const { error, ok }: UpdatePasswordResProps = await http({
      endpoint: '/auth/update-password',
      formData: {
        email,
        currentPassword,
        newPassword,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (ok) {
      handleSuccess(UPDATE_PASSWORD_SUCCESS_MESSAGE);
    }
  };

  interface UnsubscribeResProps {
    error: Error | undefined;
    resUser: User;
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true);

    const { email, customerId } = user;

    const { error, resUser }: UnsubscribeResProps = await http({
      endpoint: '/auth/unsubscribe',
      formData: {
        email,
        customerId,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (!!resUser) {
      // TODO: do Well better, how to have Attention passed as 'message'?
      updateCtx({ user: resUser });
      handleSuccess(CANCEL_SUBSCRITION_SUCCESS_MESSAGE);
    }
  };

  interface StripeCustomerResProps {
    error: Error | undefined;
    resUser: User | undefined;
    clientSecret: string | undefined;
  }

  const handleStripeCustomer = async () => {
    setIsLoading(true);

    const { username, email } = user;
    const { error, resUser, clientSecret }: StripeCustomerResProps = await http(
      {
        endpoint: '/auth/resubscribe',
        formData: {
          username,
          email,
        },
        onError: handleClientError,
      }
    );

    if (!!error) {
      handleServerError(error);
    } else if (!!clientSecret && !!resUser) {
      setClientSecret(clientSecret);
      updateCtx({ user: resUser });
      setIsLoading(false);
    }
  };

  interface ResubscribeResProps {
    error: StripeError;
  }

  const handleResubscribe = async (formValues: ResubscribeFormValues) => {
    setIsLoading(true);

    const { stripe, elements } = formValues;

    const { error: stripeError }: ResubscribeResProps =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.BASE_URL}/reactivation-success`,
        },
      });

    if (!!stripeError) {
      const { message } = stripeError,
        error = { message };
      handleServerError(error);
    }
  };

  interface DeleteResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const handleDelete = async (formValues: DeleteFormValues) => {
    setIsLoading(true);

    const { email, customerId } = user;
    const { password } = formValues;

    const { error, resUser }: DeleteResProps = await http({
      endpoint: '/auth/delete',
      formData: {
        email,
        customerId,
        password,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (resUser === null) {
      updateCtx({ user: resUser });
      handleSuccess(ACCOUNT_DELETE_SUCCESS_MESSAGE);
    }
  };

  // TODO: why was !clientSecret after !!wellData there?
  // Check that it's not important
  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Account Settings</SpacedTitle>
      {!!wellData ? <Well {...wellData} /> : null}
      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label='account and subscription tabs'
        indicatorColor='primary'
        sx={{
          marginBottom: '2rem',
          width: '100%',
          '& .MuiTabs-flexContainer	': {
            justifyContent: 'space-between',
          },
        }}
      >
        <Tab label='Update Password' />
        <Tab label='My Subscription' />
        <Tab label='Delete Account' />
      </Tabs>
      <TabPanel name='update-user' value={value} index={0}>
        <UpdatePasswordForm
          handleUpdatePassword={handleUpdatePassword}
          isLoading={isLoading}
        />
      </TabPanel>
      <TabPanel name='update-subscription' value={value} index={1}>
        <UpdateSubscriptionForm
          subscriptionStatus={subscriptionStatus}
          handleUnsubscribe={handleUnsubscribe}
          handleStripeCustomer={handleStripeCustomer}
          handleResubscribe={handleResubscribe}
          clientSecret={clientSecret}
          isLoading={isLoading}
        />
      </TabPanel>
      <TabPanel name='delete-account' value={value} index={2}>
        <DeleteAccountForm handleDelete={handleDelete} isLoading={isLoading} />
      </TabPanel>
    </PageWrapper>
  );
}
