import { useState, ReactElement, FC, ReactNode } from 'react';

import { useRouter } from 'next/router';

import { Tabs, Tab, Box } from '@mui/material';

import {
  SpacedTitle,
  UpdatePasswordForm,
  DeleteAccountForm,
  UpdateSubscriptionForm,
  UpdateEmailForm,
  Well,
  LoadMask,
  PageWrapper,
} from '@/src/components';

import {
  DEFAULT_ERROR_MESSAGE,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
  ACCOUNT_DELETE_SUCCESS_MESSAGE,
  CANCEL_SUBSCRITION_SUCCESS_MESSAGE,
  UPDATE_EMAIL_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

import {
  User,
  UpdateCtx,
  WellData,
  DefaultToastData,
} from '@/src/utils/interfaces';

import { http } from '@/src/utils';

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
  >
    {value === index ? children : null}
  </Box>
);

interface Props {
  user: User;
  updateCtx: UpdateCtx;
}

export default function Account({ user, updateCtx }: Props): ReactElement {
  const { push } = useRouter();

  const [value, setValue] = useState(0);
  const [wellData, setWellData] = useState<WellData>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    push('/login');
    return <LoadMask />;
  }

  const { email, username, subscriptionStatus, customerId } = user;

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

  interface UpdateEmailParams {
    email: string;
    confirmEmail: string;
  }

  interface UpdateEmailResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const handleUpdateEmail = async (values: UpdateEmailParams) => {
    setIsLoading(true);

    const { error, resUser }: UpdateEmailResProps = await http({
      endpoint: '/auth/update-email',
      formData: {
        email,
        newEmail: values.email.toLowerCase(),
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (!!resUser) {
      updateCtx({ user: resUser });
      handleSuccess(UPDATE_EMAIL_SUCCESS_MESSAGE);
    }
  };

  interface UpdatePasswordParams {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  interface UpdatePasswordResProps {
    error: Error | undefined;
    ok: boolean | undefined;
  }

  const handleUpdatePassword = async (values: UpdatePasswordParams) => {
    setIsLoading(true);

    const { error, ok }: UpdatePasswordResProps = await http({
      endpoint: '/auth/update-password',
      formData: {
        email: user.email,
        ...values,
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
    clientSecret: string | undefined;
  }

  const handleStripeCustomer = async () => {
    setIsLoading(true);

    // TODO: updatedUser returned here?
    const { error, clientSecret }: StripeCustomerResProps = await http({
      endpoint: '/auth/resubscribe',
      formData: {
        username,
        email,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (!!clientSecret) {
      setIsLoading(false);
      setClientSecret(clientSecret);
    }
  };

  interface ResubscribeResProps {
    error: Error;
  }

  // TODO: stripe types?
  const handleResubscribe = async (stripe, elements) => {
    setIsLoading(true);

    // TODO: Make sure this still works with `registration=true`, see registration-success
    const { error }: ResubscribeResProps = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.BASE_URL}/reactivation-success/?redirect=true&`,
      },
    });

    if (!!error) {
      handleServerError();
    }
  };

  interface deleteResProps {
    error: Error | undefined;
    resUser: User | undefined;
  }

  const handleDelete = async () => {
    //TODO: setIsLoading here too?
    const { email, customerId } = user;

    const { error, resUser }: deleteResProps = await http({
      endpoint: '/auth/delete',
      formData: {
        email,
        customerId,
      },
      onError: handleClientError,
    });

    if (!!error) {
      handleServerError(error);
    } else if (resUser === null) {
      updateCtx({ user: resUser });
      handleSuccess(ACCOUNT_DELETE_SUCCESS_MESSAGE);
      //TODO: should this reveal a button instead of auto-redirecting?
      push('/');
    }
  };

  // TODO: pagewrapper?

  return (
    <PageWrapper>
      <SpacedTitle>Account Settings</SpacedTitle>
      {!!wellData && !clientSecret ? <Well {...wellData} /> : null}
      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label='account and subscription tabs'
        indicatorColor='primary'
        centered
        sx={{ marginBottom: '2rem' }}
      >
        <Tab label='Account Settings' />
        <Tab label='My Subscription' />
        <Tab label='Update Password' />
        <Tab label='Delete Account' />
      </Tabs>

      <TabPanel name='update-user' value={value} index={0}>
        <UpdateEmailForm handleUpdateEmail={handleUpdateEmail} />
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
      <TabPanel name='update-user' value={value} index={2}>
        <UpdatePasswordForm handleUpdatePassword={handleUpdatePassword} />
      </TabPanel>
      <TabPanel name='delete-account' value={value} index={3}>
        <DeleteAccountForm handleDelete={handleDelete} />
      </TabPanel>
    </PageWrapper>
  );
}
