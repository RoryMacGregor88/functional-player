import { FC, ReactElement } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import { LevelRating } from '@/src/utils/interfaces';

import { COURSE_LEVEL_METADATA } from '@/src/utils/constants';

interface Props {
  level: LevelRating;
  includeMessage?: boolean;
}

// TODO: proper colors

const LevelRatingBadge: FC<Props> = ({ level, includeMessage = false }): ReactElement => (
  <Grid container direction='column' sx={{ width: 'fit-content' }}>
    <Box sx={{
      padding: '0.5rem',
      borderRadius: '5px',
      width: 'fit-content',
      backgroundColor: COURSE_LEVEL_METADATA[level].color,
      color: 'common.black'
    }}>
    <Typography variant='h5'>
      {COURSE_LEVEL_METADATA[level].label}
    </Typography>
    </Box>
    {includeMessage ? (
      <Typography variant='body1' sx={{ color: COURSE_LEVEL_METADATA[level].color }}>
        {COURSE_LEVEL_METADATA[level].message}
      </Typography>
    ) : null}
  </Grid>
);

export default LevelRatingBadge;
