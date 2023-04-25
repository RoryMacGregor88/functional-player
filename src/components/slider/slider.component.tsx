import { FC, useState, ReactElement, ReactNode, useEffect } from 'react';

import NextImage from 'next/image';

import {
  Grid,
  Box,
  Typography,
  ButtonBase,
  useMediaQuery,
} from '@mui/material';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LevelRatingBadge,
} from '@/src/components';

import { useCtx } from '@/src/utils';

import { Course } from '@/src/utils/interfaces';

type Orientation = 'left' | 'right';

interface OverlayProps {
  course: Course;
  isMobile: boolean;
}

const Overlay: FC<OverlayProps> = ({ course, isMobile }): ReactElement => {
  const { title, level } = course,
    positioning = {
      position: 'absolute',
      top: isMobile ? '0.5rem' : '1rem',
      right: isMobile ? '0.5rem' : '1rem',
    };
  return (
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      sx={{
        position: 'relative',
        zIndex: '1',
        height: '100%',
        width: '100%',
      }}
    >
      <Grid item sx={positioning}>
        <LevelRatingBadge level={level} small={isMobile} />
      </Grid>
      <Typography variant='h3' sx={{ fontSize: isMobile ? '1.5rem' : '3rem' }}>
        {title}
      </Typography>
    </Grid>
  );
};

interface ChevronWrapperProps {
  handleChevronClick: (direction: Orientation) => void;
  orientation: Orientation;
  children: ReactNode;
}

export const ChevronWrapper: FC<ChevronWrapperProps> = ({
  handleChevronClick,
  orientation,
  children,
}): ReactElement => (
  <Grid
    item
    container
    direction='column'
    justifyContent='center'
    alignItems='center'
    component={ButtonBase}
    disableRipple
    onClick={() => handleChevronClick(orientation)}
    data-testid={`${orientation}-chevron`}
    sx={{
      position: 'absolute',
      top: 0,
      [orientation]: 0,
      zIndex: '2',
      width: '5rem',
      height: '100%',
      cursor: 'pointer',
      '&:hover': {
        // TODO: where did this color come from?
        backgroundColor: 'rgba(8, 8, 8, 0.5)',
      },
    }}
  >
    {children}
  </Grid>
);

interface SliderProps {
  title: string;
  courses: Course[];
  banner?: boolean;
}

const Slider: FC<SliderProps> = ({
  title,
  courses,
  banner = false,
}): ReactElement => {
  const {
    updateCtx,
    ctx: { selectedCategory },
  } = useCtx();

  const isMobile = useMediaQuery('(max-width:700px)');
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (position > 0) setPosition(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const ITEM_WIDTH_REM = isMobile ? 20 : 40,
    ITEM_HEIGHT_REM = isMobile ? 12.5 : 25,
    BORDER_WIDTH = isMobile ? 3 : 5;

  const BANNER_HEIGHT = '100%',
    BANNER_WIDTH = isMobile ? '15rem' : '30rem';

  const minWidth = banner ? BANNER_HEIGHT : `${ITEM_WIDTH_REM}rem`,
    height = banner ? BANNER_WIDTH : `${ITEM_HEIGHT_REM}rem`;

  const chevronScale = {
    width: isMobile ? '4rem' : '5rem',
    height: isMobile ? '4rem' : '5rem',
  };

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
      <Typography
        variant='h4'
        sx={{
          paddingLeft: '0.5rem',
          marginBottom: '0.5rem',
          fontSize: isMobile ? '1.5rem' : '2rem',
        }}
      >
        {title}
      </Typography>
      <Grid
        container
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
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
                  color: 'common.white',
                  visibility: position === 0 ? 'hidden' : 'normal',
                  ...chevronScale,
                }}
              />
            </ChevronWrapper>
            <ChevronWrapper
              handleChevronClick={handleChevronClick}
              orientation='right'
            >
              <ChevronRightIcon
                sx={{
                  color: 'common.white',
                  visibility:
                    position === courses.length - 1 ? 'hidden' : 'normal',
                  ...chevronScale,
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
              key={course.title}
              onClick={() => handleClick(course)}
              sx={{
                position: 'relative',
                minWidth,
                height,
                border: `${BORDER_WIDTH}px solid transparent`,
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  border: `${BORDER_WIDTH}px solid #fff`,
                },
              }}
              data-testid={course.title}
            >
              <Overlay course={course} isMobile={isMobile} />
              <NextImage
                src='/strat-small.jpg'
                alt='stratocaster'
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Slider;
