import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import { DefaultToastData, Severity } from '@/src/utils/interfaces';

const severity: Severity = 'error';

const defaultErrorProps = {
  toastData: {
    severity,
    message: DEFAULT_ERROR_MESSAGE,
  },
};

interface Params {
  endpoint: string;
  formData?: object;
  method?: string;
  onError: (values: DefaultToastData) => void;
}

export default async function http({
  endpoint,
  formData,
  method = 'POST',
  onError,
}: Params): Promise<any> {
  try {
    const options = !!formData ? { body: JSON.stringify(formData) } : {};

    const test1 = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      }),
      test2 = await test1.json();

    console.log('TEST 1: ', test1);
    console.log('TEST 2: ', test2);

    return test2;
  } catch (e) {
    console.log(`ERROR IN ${endpoint} ENDPOINT: `);
    console.debug(e);
    onError(defaultErrorProps);
    return {};
  }
}
