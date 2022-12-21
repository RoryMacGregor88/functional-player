import { useEffect, FC, ReactElement, useContext } from 'react';

import { useRouter } from 'next/router';

import NextImage from 'next/image';

import { Dialog, Grid, Typography, useMediaQuery } from '@mui/material';

import {
  ArrowBackIcon,
  VideoPlayer,
  Button,
  BookmarkIconButton,
  LevelRatingBadge,
  IconButton,
} from '@/src/components';

import { updateBookmarks, updateLastWatched, Context } from '@/src/utils';

import { Course, User, UpdateCtx, Id } from '@/src/utils/interfaces';

import { ARTIST_METADATA } from '@/src/utils/constants';

interface OverlayProps {
  selectedVideoId: Id;
  selectedVideo: Course;
  isBookmarked: boolean;
  onBookmarkClick: () => void;
  push: (url: string) => void;
}

export const Overlay: FC<OverlayProps> = ({
  selectedVideoId,
  selectedVideo,
  isBookmarked,
  onBookmarkClick,
  push,
}): ReactElement => {
  const { updateCtx } = useContext(Context);

  const { title, description, level, artist } = selectedVideo,
    artistValue = ARTIST_METADATA.find(({ label }) => label === artist)?.value;

  const close = () => updateCtx({ selectedVideo: null }),
    onArtistClick = () => {
      push(`/artists?artist=${artistValue}`);
      updateCtx({ selectedVideo: null });
    },
    onMoreLikeThisClick = () => {
      // TODO: must send all categories as params to route
      console.log('See More Like This');
    };
  return (
    <Grid
      item
      container
      wrap='nowrap'
      gap={4}
      direction='column'
      justifyContent='space-evenly'
      alignItems='flex-start'
      sx={{ width: '45%', height: '100%' }}
    >
      <Grid
        item
        container
        direction='column'
        justifyContent='space-between'
        alignItems='flex-start'
        sx={{ width: '100%' }}
      >
        <Grid item container justifyContent='space-between' alignItems='center'>
          <IconButton
            data-testid='close-icon'
            onClick={close}
            sx={{ width: 'fit-content', padding: '0' }}
          >
            <ArrowBackIcon sx={{ height: '3rem', width: '3rem' }} />
          </IconButton>
          <Grid
            item
            container
            gap={2}
            wrap='nowrap'
            sx={{ width: 'fit-content' }}
          >
            <LevelRatingBadge level={level} />
            <BookmarkIconButton
              isBookmarked={isBookmarked}
              onBookmarkClick={onBookmarkClick}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          wrap='nowrap'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item container direction='column'>
            <Typography variant='h3'>{title}</Typography>
            <Typography variant='body1'>{description}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container sx={{ width: '100%', height: '50%' }}>
        <VideoPlayer selectedVideoId={selectedVideoId} title={title} />
      </Grid>
      <Grid item container alignItems='center' gap='1rem' wrap='nowrap'>
        <Button onClick={onArtistClick}>More From This Artist</Button>
        <Button onClick={onMoreLikeThisClick}>See More Like this</Button>
      </Grid>
    </Grid>
  );
};

interface VideoDialogProps {
  open: boolean;
  user: User;
  selectedVideo: Course;
  updateCtx: UpdateCtx;
}

const VideoDialog: FC<VideoDialogProps> = ({
  open,
  user,
  selectedVideo,
  updateCtx,
}): ReactElement => {
  const { push } = useRouter();

  const { _id, videoId } = selectedVideo ?? {};

  // TODO: useEffect not running
  // also, this needs to fire when Vimeo play button is clicked, not on mount

  // useEffect(() => {
  //   if (!!selectedVideo) {
  //     updateLastWatched({ user, _id, updateCtx });
  //   }
  // }, [_id, selectedVideo, updateCtx, user]);

  const isMedium = useMediaQuery('(max-width:1200px)');
  const isSmall = useMediaQuery('(max-width:600px)');

  if (!selectedVideo) return null;

  const deviceSize = isSmall ? 'small' : isMedium ? 'medium' : 'large';
  const isBookmarked = !!user?.bookmarks.includes(_id);

  const onActionClick = (path) => {
    push(path);
    updateCtx({ selectedVideo: null });
  };

  const onBookmarkClick = () =>
    !!user
      ? updateBookmarks({ _id, user, updateCtx })
      : updateCtx({
          dialogData: {
            title: 'Welcome to Functional Player',
            message:
              'You must be logged in to perform this action. Please either login or register with us using the buttons below.',
            actions: [
              {
                label: 'Login',
                onClick: () => onActionClick('/login'),
                closeOnClick: true,
              },
              {
                label: 'Register',
                onClick: () => onActionClick('/register'),
                closeOnClick: true,
              },
            ],
          },
        });

  return (
    <Dialog
      open={open}
      fullScreen
      transitionDuration={500}
      sx={{ zIndex: 2000 }}
    >
      <Grid container sx={{ height: '100%', width: '100%' }}>
        <NextImage
          src={`/telecaster-${deviceSize}.jpg`}
          alt='telecaster-image'
          objectFit='cover'
          layout='fill'
          quality={100}
        />
        <Grid
          item
          container
          justifyContent='center'
          alignItems='center'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '0 2rem',
          }}
        >
          <Overlay
            selectedVideoId={videoId}
            selectedVideo={selectedVideo}
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
            push={push}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
