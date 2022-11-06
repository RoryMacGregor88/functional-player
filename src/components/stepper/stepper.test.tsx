import { render, screen } from '@/src/utils/test-utils';

import Stepper from './stepper.component';

describe('Stepper', () => {
  it('renders', () => {
    render(<Stepper activeStep={1} />);

    expect(screen.getByLabelText(/create account/i)).toBeInTheDocument();
  });
});
