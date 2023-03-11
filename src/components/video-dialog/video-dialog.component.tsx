import { useEffect, FC, ReactElement } from 'react';

import { useRouter } from 'next/router';

import NextImage from 'next/image';

import { Dialog, Grid, Typography, useMediaQuery } from '@mui/material';

import {
  CloseIcon,
  VideoPlayer,
  BookmarkIconButton,
  LevelRatingBadge,
  IconButton,
  Link,
  LinkButton,
} from '@/src/components';

import { updateBookmarks, updateLastWatched, useCtx } from '@/src/utils';

import { Course, UpdateCtx, Id } from '@/src/utils/interfaces';

import { ARTIST_METADATA } from '@/src/utils/constants';

interface OverlayProps {
  selectedVideoId: Id;
  selectedVideo: Course;
  isBookmarked: boolean;
  onBookmarkClick: () => void;
  close: () => void;
}

export const Overlay: FC<OverlayProps> = ({
  selectedVideoId,
  selectedVideo,
  isBookmarked,
  onBookmarkClick,
  close,
}): ReactElement => {
  const { updateCtx } = useCtx();

  // TODO: spacing between video and elements is a bit big

  const { title, description, level, artist, categories } = selectedVideo,
    artistValue = ARTIST_METADATA.find(({ label }) => label === artist)?.value;

  const handleLinkClick = () => updateCtx({ selectedVideo: null });
  return (
    <Grid
      item
      container
      wrap='nowrap'
      gap={4}
      direction='column'
      justifyContent='space-between'
      alignItems='flex-start'
      sx={{
        height: '50rem',
        width: '60rem',
        border: '2px solid #fff',
        borderRadius: 3,
        padding: '2.5rem',
        position: 'relative',
      }}
    >
      <IconButton
        data-testid='close-icon'
        onClick={close}
        sx={{
          width: 'fit-content',
          padding: '0',
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
        }}
      >
        <CloseIcon sx={{ height: '2rem', width: '2rem' }} />
      </IconButton>

      <VideoPlayer selectedVideoId={selectedVideoId} title={title} />

      <Grid item container direction='column' gap={1}>
        <Grid
          item
          container
          justifyContent='space-between'
          alignItems='center'
          gap={2}
          wrap='nowrap'
        >
          <Typography
            variant='h3'
            sx={{ fontSize: '2rem', marginRight: 'auto' }}
          >
            {title}
          </Typography>
          <LevelRatingBadge level={level} />
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
          />
        </Grid>

        <Grid
          item
          container
          justifyContent='space-between'
          alignItems='center'
          gap={2}
          wrap='nowrap'
        >
          <Typography
            variant='h3'
            sx={{ fontSize: '1.5rem', marginRight: 'auto' }}
          >
            <Link href={`/artists?artist=${artistValue}`}>
              <LinkButton noLeftMargin onClick={handleLinkClick}>
                {artist}
              </LinkButton>
            </Link>
          </Typography>
          {categories.map((cat) => (
            <Link key={cat} href={`/categories?category=${cat}`}>
              <LinkButton onClick={handleLinkClick}>{cat}</LinkButton>
            </Link>
          ))}
        </Grid>

        <Typography variant='body1'>{description}</Typography>
      </Grid>
    </Grid>
  );
};

interface VideoDialogProps {
  open: boolean;
  selectedVideo: Course;
  updateCtx: UpdateCtx;
}

const VideoDialog: FC<VideoDialogProps> = ({
  open,
  selectedVideo,
  updateCtx,
}): ReactElement => {
  const {
    ctx: { user },
  } = useCtx();
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

  // guard is here because selectedVideo gets set to null when dialog is
  // closed, and will error if null is passed to children components
  if (!selectedVideo) return null;

  // TODO: delete this?
  const deviceSize = isSmall ? 'small' : isMedium ? 'medium' : 'large';
  const isBookmarked = !!user?.bookmarks.includes(_id);

  const close = () => updateCtx({ selectedVideo: null });

  const onActionClick = (path) => {
    push(path);
    updateCtx({ selectedVideo: null });
  };

  const onBookmarkClick = () =>
    !!user
      ? updateBookmarks({ _id, user, updateCtx })
      : updateCtx({
          dialogData: {
            title: 'Welcome to FunctionalPlayer',
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
      onBackdropClick={close}
      transitionDuration={500}
      sx={{
        zIndex: 2000,
        '.MuiDialog-paper': {
          backgroundImage: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          maxWidth: 'none',
          maxheight: 'none',
        },
      }}
    >
      <Grid container justifyContent='center' alignItems='center'>
        <Overlay
          selectedVideoId={videoId}
          selectedVideo={selectedVideo}
          isBookmarked={isBookmarked}
          onBookmarkClick={onBookmarkClick}
          close={close}
        />
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
