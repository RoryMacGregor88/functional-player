import { Alert, AlertTitle } from "@mui/material";

/**
 * @param {{
 *  title?: string
 *  message: string
 *  severity?: string
 * }} props
 */
const Well = ({ title = null, message, severity = "error" }) => {
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
