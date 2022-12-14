import { FC, ReactElement, ReactNode } from 'react';

import { Grid } from '@mui/material';

interface Props {
  onSubmit: () => void;
  children: ReactNode;
}

const FormWrapper: FC<Props> = ({ onSubmit, children }): ReactElement => (
  <Grid
    item
    container
    component='form'
    direction='column'
    gap='1rem'
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    {children}
  </Grid>
);

export default FormWrapper;
