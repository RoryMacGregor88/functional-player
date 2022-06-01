import { Alert, AlertTitle } from "@mui/material";

/**
 * @param {{
 *  title?: string,
 *  message: string,
 *  stack: any,
 *  severity?: string
 * }} props
 */
const Well = ({ title, message, stack, severity = "error" }) => {
  console.error("ERROR STACK: ", stack);
  return (
    <Alert
      severity={severity}
      sx={{ width: "100%", padding: "1rem", marginBottom: "2rem" }}
    >
      {!!title ? <AlertTitle>{title}</AlertTitle> : null}
      {message}
    </Alert>
  );
};

export default Well;
