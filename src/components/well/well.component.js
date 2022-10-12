import { Alert, AlertTitle } from "@mui/material";

// TODO: do something with 'stack', maybe display message to user

/**
 * @param {{
 *  title?: string,
 *  message: string,
 *  stack?: any,
 *  severity?: string
 * }} props
 */
const Well = ({ title = null, message, stack, severity = "error" }) => {
  const defaultTitle = severity === "error" ? "Error!" : "Success!";
  return (
    <Alert
      severity={severity}
      sx={{ width: "100%", padding: "1rem", marginBottom: "2rem" }}
    >
      <AlertTitle>{title ?? defaultTitle}</AlertTitle>
      {message}
    </Alert>
  );
};

export default Well;
