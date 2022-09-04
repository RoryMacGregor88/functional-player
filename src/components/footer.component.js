import { IconButton, Grid, Typography, Link } from "@mui/material";

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  RedditIcon,
  YouTubeIcon,
} from "@/src/components";

const Footer = () => {
  const icons = [
    { Icon: FacebookIcon, url: "https://www.facebook.com", label: "Facebook" },
    {
      Icon: InstagramIcon,
      url: "https://www.instagram.com",
      label: "Instagram",
    },
    { Icon: TwitterIcon, url: "https://www.twitter.com", label: "Twitter" },
    { Icon: RedditIcon, url: "https://www.reddit.com", label: "Reddit" },
    { Icon: YouTubeIcon, url: "https://www.youtube.com", label: "YouTube" },
  ];

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      component="footer"
      sx={{
        padding: "1rem",
        backgroundColor: "palette.background.default",
        borderTopColor: "palette.primary.main",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
      }}
    >
      <Grid
        item
        container
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ marginBottom: "1rem" }}
      >
        {icons.map(({ Icon, url, label }) => (
          <Link
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: "10rem",
              textDecoration: "none",
              opacity: "0.75",
              "&:hover": {
                color: "primary.main",
                opacity: "1",
              },
            }}
          >
            <IconButton color="primary" disableRipple>
              <Icon
                sx={{
                  height: "2.5rem",
                  width: "2.5rem",
                  marginRight: "0.5rem",
                }}
              />
            </IconButton>
            <Typography variant="h6">{label}</Typography>
          </Link>
        ))}
      </Grid>
      <Typography
        variant="body1"
        sx={{ textAlign: "center", marginBottom: "0.25rem" }}
      >
        Copyright &copy; {new Date().getFullYear()} Functional Player | Terms
        &amp; Conditions | Privacy Policy
      </Typography>
    </Grid>
  );
};

export default Footer;
