import { screen, render } from '@/src/utils/test-utils';

import Well from './well.component';

describe('Well', () => {
  it('renders with title and message', () => {
    const title: string = 'test-title';
    const message: string = 'test-message';

    render(<Well title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('defaults to Error title if no title given', () => {
    render(<Well message='' />);

    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('shows Success title if success severity passed', () => {
    render(<Well message='' severity='success' />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});
