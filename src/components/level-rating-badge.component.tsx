import { FC, ReactElement } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import { LevelRating } from '@/src/utils/interfaces';

import { COURSE_LEVEL_METADATA } from '@/src/utils/constants';

interface Props {
  level: LevelRating;
}

const LevelRatingBadge: FC<Props> = ({ level }): ReactElement => {
  const levelMetadata = COURSE_LEVEL_METADATA.find(
    ({ value }) => value === level
  );
  return (
    <Grid container direction='column' sx={{ width: 'fit-content' }}>
      <Box
        sx={{
          padding: '0.25rem 0.5rem',
          borderRadius: '3px',
          width: 'fit-content',
          backgroundColor: levelMetadata.color,
          color: 'common.black',
        }}
      >
        <Typography variant='h5'>{levelMetadata.label}</Typography>
      </Box>
    </Grid>
  );
};

export default LevelRatingBadge;