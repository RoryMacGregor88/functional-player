import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import FormWrapper from './form-wrapper.component';

describe('FormWrapper', () => {
  it('renders', () => {
    render(
      <FormWrapper>
        <span>test form</span>
      </FormWrapper>
    );

    expect(screen.getByText(/test form/i)).toBeInTheDocument();
  });

  it('calls submit handler', async () => {
    const onSubmit = jest.fn();
    render(
      <FormWrapper onSubmit={onSubmit}>
        <button type='submit'>submit</button>
      </FormWrapper>
    );

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
