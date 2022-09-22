const VideoPlayer = ({ videoId, alt, height = "360", width = "640" }) => (
  <iframe
    src={`https://player.vimeo.com/video/${videoId}`}
    alt={alt}
    width={width}
    height={height}
    frameBorder="0"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
    style={{
      display: "block",
    }}
  />
);

export default VideoPlayer;
