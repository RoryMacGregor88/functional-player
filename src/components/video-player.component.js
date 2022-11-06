/**
 * @param {{
 *  videoId: string
 *  alt: string
 * }} props
 */
const VideoPlayer = ({ videoId, alt }) => (
  <iframe
    src={`https://player.vimeo.com/video/${videoId}`}
    alt={alt}
    frameBorder='0'
    webkitallowfullscreen='true'
    mozallowfullscreen='true'
    allowFullScreen
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0,
    }}
  />
);

export default VideoPlayer;
