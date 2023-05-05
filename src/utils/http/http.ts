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
  formData?: Record<string, any>;
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

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (e) {
    onError(defaultToastData);
    /** empty object so return value can be destructured */
    return {};
  }
}
