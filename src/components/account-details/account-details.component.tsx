import { FC, ReactElement } from 'react';

import { Grid, Typography } from '@mui/material';

import { Button } from '@/src/components';

interface Props {
  handleLogoutFromAllClick: () => void;
}

const AccountDetails: FC<Props> = ({
  handleLogoutFromAllClick,
}): ReactElement => {
  return (
    <Grid container alignItems='center' gap='1rem'>
      <Typography variant='h5'>Below is a sumary of your account:</Typography>
      <Typography variant='body1'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum
        facere minima sit aliquid qui, veritatis saepe animi deserunt quidem
        quod possimus cumque culpa consequuntur aspernatur sunt at,
        necessitatibus dolores commodi!
      </Typography>
      <Button onClick={handleLogoutFromAllClick}>
        Log out from all devices
      </Button>
    </Grid>
  );
};

export default AccountDetails;
