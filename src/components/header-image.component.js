import NextImage from "next/image";
import { Grid, Typography, useMediaQuery } from "@mui/material";

/**
 * @param {{
 *  src: string,
 *  alt: string,
 *  title: string,
 *  imageProps?: object,
 *  deviceSize: string
 * }} props
 */
const Device = ({ src, alt, title, imageProps = {}, deviceSize }) => (
  <Grid
    container
    alignItems="flex-start"
    sx={{
      position: "relative",
      height: "85vh",
      width: "100%",
    }}
  >
    <Grid
      item
      container
      alignItems="flex-end"
      justifyContent="center"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "50vh",
        width: "100vw",
        zIndex: 1000,
        backgroundImage:
          "linear-gradient(to top, rgb(8, 8, 8) 50%, rgba(8, 8, 8, 0.75) 75%, rgba(8, 8, 8, 0) 100%)",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="space-evenly"
        wrap="nowrap"
        sx={{
          height: "50%",
          padding: "2rem",
          marginBottom: "1rem",
        }}
      >
        <Typography variant="h3">{title}</Typography>
        <Typography variant="h5">
          This is some description information.
        </Typography>
        <Typography variant="body1">Some extra information.</Typography>
      </Grid>
    </Grid>
    <Grid
      item
      sx={{
        height: "76.5vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <NextImage
        src={`${src}-${deviceSize}.jpg`}
        alt={alt}
        objectFit="cover"
        layout="fill"
        quality={100}
        {...imageProps}
      />
    </Grid>
  </Grid>
);

/**
 * @param {{
 *  src: string,
 *  alt: string,
 *  title: 'string',
 *  imageProps?: object,
 * }} props
 */
const Desktop = ({ src, alt, title, imageProps = {} }) => (
  <Grid
    container
    justifyContent="flex-end"
    sx={{
      position: "relative",
      height: "85vh",
      width: "100%",
    }}
  >
    <Grid
      item
      container
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "85vh",
        width: "50vw",
        zIndex: 1000,
        backgroundImage:
          "linear-gradient(to right, rgb(8, 8, 8) 50%, rgba(8, 8, 8, 0.75) 75%, rgba(8, 8, 8, 0) 100%)",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="space-evenly"
        sx={{
          height: "50%",
          width: "75%",
        }}
      >
        <Typography variant="h2">{title}</Typography>
        <Typography variant="h4">
          This is some description information.
        </Typography>
        <Typography variant="h6">Some extra information.</Typography>
      </Grid>
    </Grid>
    <Grid
      item
      sx={{
        width: "90vw",
        position: "relative",
      }}
    >
      <NextImage
        src={`${src}-large.jpg`}
        alt={alt}
        objectFit="cover"
        layout="fill"
        quality={100}
        {...imageProps}
      />
    </Grid>
  </Grid>
);

/** @param {object} props */
const HeaderImage = (props) => {
  const isMedium = useMediaQuery("(max-width:1000px)");
  const isSmall = useMediaQuery("(max-width:600px)");

  const deviceSize = isSmall ? "small" : isMedium ? "medium" : "large";

  // TODO: make this re-usable across all pages but with different images and text

  // TODO: make sure this shit working. NextImage better for this? is it SSR?
  if (isSmall) {
    return <Device {...props} deviceSize={deviceSize} />;
  } else if (isMedium) {
    return <Device {...props} deviceSize={deviceSize} />;
  } else {
    return <Desktop {...props} />;
  }
};

export default HeaderImage;
