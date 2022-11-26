import { FC, useState, useContext, ReactNode, ReactElement } from 'react';

import NextImage from 'next/image';

import { Grid, Box, Typography } from '@mui/material';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/src/components';

import { Context } from '@/src/utils';

import { Course } from '@/src/utils/interfaces';

const ITEM_WIDTH_REM = 40;
const ITEM_HEIGHT_REM = 25;

type Orientation = 'left' | 'right';

interface OverlayProps {
  course: Course;
}

const Overlay: FC<OverlayProps> = ({ course }): ReactElement => {
  const { title, description } = course;
  return (
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      style={{
        position: 'absolute',
        zIndex: '1',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography variant='h3'>{title}</Typography>
      <Typography variant='h5'>{description}</Typography>
    </Grid>
  );
};

interface ChevronWrapperProps {
  handleChevronClick: (direction: Orientation) => void;
  orientation: Orientation;
  children: ReactNode;
}

const ChevronWrapper: FC<ChevronWrapperProps> = ({
  handleChevronClick,
  orientation,
  children,
}): ReactElement => {
  const onClick = () => handleChevronClick(orientation);
  // TODO: should this be some kind of button?
  return (
    <Grid
      item
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: 0,
        [orientation]: 0,
        zIndex: '2',
        width: '5rem',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgb(8, 8, 8, 0.5)',
        },
      }}
    >
      {children}
    </Grid>
  );
};

interface SliderProps {
  title: string;
  courses: Course[];
  banner?: boolean;
}

const Slider: FC<SliderProps> = ({ title, courses, banner = false }): ReactElement => {
  const { updateCtx } = useContext(Context);
  const [position, setPosition] = useState(0);

  if (!courses?.length) {
    return null;
  }

  const minWidth = banner ? 'calc(100vw - 4rem)' : `${ITEM_WIDTH_REM}rem`,
    height = banner ? '30rem' : `${ITEM_HEIGHT_REM}rem`;

  const handleClick = (course: Course): void =>
    updateCtx({ selectedVideo: course });

  const handleChevronClick = (direction: Orientation): void => {
    if (direction === 'right' && position !== courses.length - 1) {
      setPosition((prev) => prev + 1);
    } else if (direction === 'left' && position !== 0) {
      setPosition((prev) => prev - 1);
    }
  };

  return (
    <>
      <Typography variant='h4' sx={{ paddingLeft: '0.5rem', marginBottom: '0.5rem' }}>
        {title}
      </Typography>
      <Grid
        container
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: 'calc(100vw - 4rem)',
          marginBottom: '2rem',
        }}
      >
        {!banner && courses.length > 1 ? (
          <>
            <ChevronWrapper
              handleChevronClick={handleChevronClick}
              orientation='left'
            >
              <ChevronLeftIcon
                sx={{
                  width: '5rem',
                  height: '5rem',
                  color: 'common.white',
                  visibility: position === 0 ? 'hidden' : 'normal',
                }}
              />
            </ChevronWrapper>
            <ChevronWrapper
              handleChevronClick={handleChevronClick}
              orientation='right'
            >
              <ChevronRightIcon
                sx={{
                  width: '5rem',
                  height: '5rem',
                  color: 'common.white',
                  visibility:
                    position === courses.length - 1 ? 'hidden' : 'normal',
                }}
              />
            </ChevronWrapper>
          </>
        ) : null}

        <Grid
          item
          container
          wrap='nowrap'
          gap={1}
          sx={{
            transform:
              position === 0
                ? 'none'
                : `translateX(-${(ITEM_WIDTH_REM + 0.5) * position}rem)`,
            transitionDuration: '0.25s',
          }}
        >
          {courses.map((course) => (
            <Box
              key={course._id}
              onClick={() => handleClick(course)}
              sx={{
                position: 'relative',
                minWidth,
                height,
                border: '8px solid transparent',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  border: '8px solid #fff',
                },
              }}
              data-testid={course.title}
            >
              <Overlay course={course} />
              <NextImage
                src='/stratocaster-medium.jpg'
                alt='stratocaster'
                layout='fill'
                objectFit='cover'
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Slider;
