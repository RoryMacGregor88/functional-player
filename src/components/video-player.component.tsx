import { FC, ReactElement } from 'react';

import { Id } from '@/src/utils/interfaces';

interface Props {
  selectedVideoId: Id;
  title: string;
}

const VideoPlayer: FC<Props> = ({ selectedVideoId, title }): ReactElement => (
  <iframe
    // src={`https://player.vimeo.com/video/${selectedVideoId}`}
    // hardcoded for now, as there is only 1 video on Vimeo
    src={`https://player.vimeo.com/video/828060656`}
    title={title}
    frameBorder='0'
    allowFullScreen
    style={{
      width: '100%',
      height: '100%',
      border: 0,
    }}
  />
);

export default VideoPlayer;
