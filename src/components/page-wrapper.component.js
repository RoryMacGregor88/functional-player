import { Box } from "@mui/material";

const PageWrapper = ({ children }) => (
  <Box
    sx={{
      maxWidth: "80rem",
      margin: "0 auto",
      padding: "0 2rem",
    }}
  >
    {children}
  </Box>
);

export default PageWrapper;
