import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import { DefaultToastData, Severity } from '@/src/utils/interfaces';

const defaultToastData: DefaultToastData = {
  toastData: {
    severity: 'error' as Severity,
    message: DEFAULT_ERROR_MESSAGE,
  },
};

interface Params {
  endpoint: string;
  formData?: Record<string, unknown>;
  method?: string;
  onError: (defaultToastData: DefaultToastData) => void;
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
    onError(defaultToastData);
    // empty object so return value can be destructured
    return {};
  }
}
