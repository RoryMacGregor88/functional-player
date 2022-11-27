import { useEffect, FC, ReactElement } from 'react';

import { useRouter } from 'next/router';

import NextImage from 'next/image';

import {
  Dialog,
  IconButton,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';

import {
  ArrowBackIcon,
  VideoPlayer,
  Button,
  BookmarkIconButton,
} from '@/src/components';

import { updateBookmarks, updateLastWatched } from '@/src/utils';

import { Course, User, UpdateCtx, Id } from '@/src/utils/interfaces'

interface OverlayProps {
  selectedVideoId: Id;
  selectedVideo: Course;
  isBookmarked: boolean;
  onBookmarkClick: () => void;
  updateCtx: UpdateCtx;
}

const Overlay: FC<OverlayProps> = ({
  selectedVideoId,
  selectedVideo,
  isBookmarked,
  onBookmarkClick,
  updateCtx,
}): ReactElement => {
  const { title, description } = selectedVideo,
    close = () => updateCtx({ selectedVideo: null });
  return (
    <Grid
      item
      container
      wrap='nowrap'
      gap={4}
      direction='column'
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        position: 'relative',
        width: '50%',
        height: '100%',
      }}
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
            onClick={close}
            sx={{ width: 'fit-content', padding: '0' }}
          >
            <ArrowBackIcon sx={{ height: '2.5rem', width: '2.5rem' }} />
          </IconButton>
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
          />
        </Grid>
        <>
          <Typography variant='h2'>{title}</Typography>
          <Typography variant='body1'>{description}</Typography>
        </>
      </Grid>
      <Grid
        item
        container
        direction='column'
        alignItems='center'
        sx={{ width: '100%', height: '50%', position: 'relative' }}
      >
        <VideoPlayer selectedVideoId={selectedVideoId} title={title} />
      </Grid>
      <Grid item container alignItems='center' gap='1rem' wrap='nowrap'>
        <Button onClick={() => console.log('More')}>More</Button>
        <Button onClick={() => console.log('Feedback')}>Feedback</Button>
      </Grid>
    </Grid>
  );
};

interface VideoDialogProps {
  open: boolean;
  user: User | null;
  selectedVideo: Course;
  updateCtx: UpdateCtx;
}

const VideoDialog: FC<VideoDialogProps> = ({ open, user, selectedVideo, updateCtx }): ReactElement => {
  const router = useRouter();

  const { _id, videoId } = selectedVideo ?? {};

  // TODO: useEffect not running
  // TODO: this needs to fire when Vimeo play button is clicked, not on mount
  useEffect(() => {
    if (!!selectedVideo) {
      updateLastWatched(user, _id, updateCtx);
    }
  }, []);

  const isMedium = useMediaQuery('(max-width:1200px)');
  const isSmall = useMediaQuery('(max-width:600px)');

  if (!selectedVideo) {
    return null;
  }

  // TODO: add trailerId to all videos in db
  const trailerId = videoId;

  // TODO: test this
  const selectedVideoId = videoId && user?.subscriptionStatus === 'active' ? videoId : trailerId

  const deviceSize = isSmall ? 'small' : isMedium ? 'medium' : 'large';
  const isBookmarked = !!user?.bookmarks.includes(_id);

  const onActionClick = (path) => {
    router.push(path);
    updateCtx({ selectedVideo: null });
  };

  const onBookmarkClick = () =>
    !!user
      ? updateBookmarks(_id, user, updateCtx)
      : updateCtx({
          dialogData: {
            title: 'Welcome to Functional Player',
            message:
              'You must have a user account to save courses to your list. Please either login or register with us using the buttons below.',
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
      <Grid
        container
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      >
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
            selectedVideoId={selectedVideoId}
            selectedVideo={selectedVideo}
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
            updateCtx={updateCtx}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
