import { useContext } from 'react';

import NextImage from 'next/image';

import { Grid, Box, Typography } from '@mui/material';

import { Context } from '@/src/utils';

const Overlay = ({ course }) => {
  const { title, description } = course;
  return (
    <Grid
      container
      direction='column'
      justifyContent='center'
      style={{
        position: 'absolute',
        padding: '1rem',
        zIndex: '100',
      }}
    >
      <Typography variant='h5'>{title}</Typography>
      <Typography variant='body1'>{description}</Typography>
    </Grid>
  );
};

// TODO: styling of this still broke on any pages?
// also, is this still needed now that dashboard exists?
/** @param {{ course: object }} props */
const CourseDisplay = ({ course }) => {
  const { updateCtx } = useContext(Context);

  if (!course) {
    return null;
  }

  const { src, alt } = course;

  const handleClick = () => {
    updateCtx({
      selectedVideo: course,
    });
  };

  return (
    <Grid
      item
      container
      direction='column'
      xs={12}
      md={6}
      onClick={handleClick}
    >
      <Box
        sx={{
          position: 'relative',
          height: '25rem',
          width: '30rem',
          margin: '0',
          cursor: 'pointer',
          borderRadius: 1,
          overflow: 'hidden',
          border: '5px solid transparent',
          '&:hover': {
            border: '5px solid',
            borderColor: 'palette.main',
          },
        }}
      >
        <Overlay course={course} />
        <NextImage layout='fill' objectFit='cover' src={src} alt={alt} />
      </Box>
    </Grid>
  );
};

export default CourseDisplay;
