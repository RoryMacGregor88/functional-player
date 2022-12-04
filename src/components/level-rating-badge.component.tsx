import { FC, ReactElement } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import { LevelRating } from '@/src/utils/interfaces';

import { COURSE_LEVEL_METADATA } from '@/src/utils/constants';

interface Props {
  level: LevelRating;
  includeMessage?: boolean;
}

// TODO: proper colors

const LevelRatingBadge: FC<Props> = ({ level, includeMessage = false }): ReactElement => {
  const levelMetadata = COURSE_LEVEL_METADATA.find(({ value }) => value === level);
  return (
    <Grid container direction='column' sx={{ width: 'fit-content' }}>
    <Box sx={{
      padding: '0.5rem',
      borderRadius: '5px',
      width: 'fit-content',
      backgroundColor: levelMetadata.color,
      color: 'common.black'
    }}>
    <Typography variant='h5'>
      {levelMetadata.label}
    </Typography>
    </Box>
    {includeMessage ? (
      <Typography variant='body1' sx={{ color: levelMetadata.color }}>
        {levelMetadata.message}
      </Typography>
    ) : null}
  </Grid>
  )
};

export default LevelRatingBadge;
