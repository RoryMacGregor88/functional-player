import { FC, ReactElement } from 'react';

import NextImage from 'next/image';

import { Grid, Typography, useMediaQuery } from '@mui/material';

import { LinkButton } from '@/src/components';

import { useCtx } from '@/src/utils';

import { UpdateCtx } from '@/src/utils/interfaces';

const HARDCODED_INTRODUCTION_VIDEO = {
  videoId: '579544403',
  _id: 'f31a1831-b82b-4057-8cb4-8bf869e0f1ff',
  title: 'Joe Bonamassa 17',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  artist: 'Joe Bonamassa',
  creationDate: '2022-12-04T19:41:25.686Z',
  level: 'advanced',
  categories: ['hiddenGems', 'rock', 'funk', 'artist', 'advanced'],
};

interface DeviceProps {
  src: string;
  alt: string;
  deviceSize: string;
  updateCtx: UpdateCtx;
}

const Device: FC<DeviceProps> = ({
  src,
  alt,
  deviceSize,
  updateCtx,
}): ReactElement => (
  <Grid
    container
    alignItems='flex-start'
    sx={{
      position: 'relative',
      height: '75vh',
      width: '100%',
      marginBottom: '2rem',
    }}
  >
    <Grid
      item
      container
      alignItems='flex-end'
      justifyContent='center'
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '50vh',
        width: '100vw',
        zIndex: 1000,
        backgroundImage:
          'linear-gradient(to top, rgb(21, 21, 21) 25%, rgba(21, 21, 21, 0.75) 50%, rgba(21, 21, 21, 0) 100%)',
      }}
    >
      <Grid
        item
        container
        direction='column'
        justifyContent='space-evenly'
        alignItems='center'
        wrap='nowrap'
        gap='0.5rem'
        sx={{
          height: '50%',
          padding: '2rem',
          marginBottom: '1rem',
        }}
      >
        <Typography variant='h5' sx={{ fontStyle: 'italic' }}>
          &quot;If you play everything straight, it&apos;ll sound so cold, so
          boring. How is it going to sound like it&apos;s saying something?
          Otherwise it&apos;s just notes, and anyone can play notes.&quot;{' '}
          <span style={{ fontStyle: 'normal' }}>- Gary Moore, 2004</span>
        </Typography>
        <Typography variant='h6'>
          What makes a guitarist sound &ldquo;genuine&rdquo;? It&apos;s not
          enough to just play the notes. Join over 100,000 students around the
          world, and discover the art of expressive electric lead guitar.
        </Typography>
        <LinkButton
          noLeftMargin
          onClick={() =>
            updateCtx({ selectedVideo: HARDCODED_INTRODUCTION_VIDEO })
          }
        >
          Click here to watch the introduction video
        </LinkButton>
      </Grid>
    </Grid>
    <Grid
      item
      sx={{
        height: '75vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      <NextImage
        src={`/${src}-${deviceSize}.jpg`}
        alt={alt}
        fill
        quality={100}
        style={{
          objectFit: 'cover',
        }}
      />
    </Grid>
  </Grid>
);

interface DesktopProps {
  src: string;
  alt: string;
  updateCtx: UpdateCtx;
}

const Desktop: FC<DesktopProps> = ({ src, alt, updateCtx }): ReactElement => (
  <Grid
    container
    justifyContent='flex-end'
    sx={{
      position: 'relative',
      height: '75vh',
      width: '100%',
      marginBottom: '2rem',
    }}
  >
    <Grid
      item
      container
      alignItems='center'
      justifyContent='center'
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '75vh',
        width: '50vw',
        zIndex: 1000,
        backgroundImage:
          'linear-gradient(to right, rgb(21, 21, 21) 25%, rgba(21, 21, 21, 0.75) 50%, rgba(21, 21, 21, 0) 100%)',
      }}
    >
      <Grid
        item
        container
        direction='column'
        justifyContent='space-evenly'
        alignItems='center'
        sx={{
          height: '50%',
          width: '75%',
          textAlign: 'center',
        }}
      >
        <Typography variant='h5' sx={{ fontStyle: 'italic' }}>
          &quot;If you play everything straight, it&apos;ll sound so cold, so
          boring. How is it going to sound like it&apos;s saying something?
          Otherwise it&apos;s just notes, and anyone can play notes.&quot;{' '}
          <span style={{ fontStyle: 'normal' }}>- Gary Moore, 2004</span>
        </Typography>
        <Typography variant='h6'>
          What makes a guitarist sound &ldquo;genuine&rdquo;? It&apos;s not
          enough to just play the notes. Join over 100,000 students around the
          world, and discover the art of expressive electric lead guitar.
        </Typography>
        <LinkButton
          noLeftMargin
          onClick={() =>
            updateCtx({ selectedVideo: HARDCODED_INTRODUCTION_VIDEO })
          }
        >
          Click here to watch the introduction video
        </LinkButton>
      </Grid>
    </Grid>
    <Grid
      item
      sx={{
        width: '75vw',
        height: '75vh',
        position: 'relative',
      }}
    >
      <NextImage
        src={`/${src}-large.jpg`}
        alt={alt}
        fill
        quality={100}
        style={{ objectFit: 'cover' }}
      />
    </Grid>
  </Grid>
);

interface HeaderImageProps {
  src: string;
  alt: string;
}

const HeaderImage: FC<HeaderImageProps> = ({ src, alt }) => {
  const { updateCtx } = useCtx();

  const isMedium = useMediaQuery('(max-width:1000px)'),
    isSmall = useMediaQuery('(max-width:600px)');

  const deviceSize = isSmall ? 'small' : isMedium ? 'medium' : 'large';
  if (isSmall) {
    return (
      <Device
        src={src}
        alt={alt}
        deviceSize={deviceSize}
        updateCtx={updateCtx}
      />
    );
  } else if (isMedium) {
    return (
      <Device
        src={src}
        alt={alt}
        deviceSize={deviceSize}
        updateCtx={updateCtx}
      />
    );
  } else {
    return <Desktop src={src} alt={alt} updateCtx={updateCtx} />;
  }
};

export default HeaderImage;
