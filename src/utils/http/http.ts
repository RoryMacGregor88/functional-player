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
    return await (
      await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      })
    ).json();
  } catch (e) {
    console.log(`ERROR IN ${endpoint} ENDPOINT: `, e);
    onError(defaultErrorProps);
    return {};
  }
}
