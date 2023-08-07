import { FC, ReactElement } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import { LevelRating } from '@/src/utils/interfaces';

import { COURSE_LEVEL_METADATA } from '@/src/utils/constants';

interface Props {
  level: LevelRating;
  small?: boolean;
}

const LevelRatingBadge: FC<Props> = ({
  level,
  small = false,
}): ReactElement => {
  const levelMetadata = COURSE_LEVEL_METADATA.find(
    ({ value }) => value === level.value
  );
  return (
    <Grid container direction='column' sx={{ width: 'fit-content' }}>
      <Box
        sx={{
          padding: '0.25rem 0.5rem',
          borderRadius: 1,
          width: 'fit-content',
          backgroundColor: levelMetadata.color,
          color: 'common.white',
        }}
      >
        <Typography variant='h5' sx={{ fontSize: small ? '1rem' : '1.5rem' }}>
          {levelMetadata.label}
        </Typography>
      </Box>
    </Grid>
  );
};

export default LevelRatingBadge;
