import { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Head from "next/head";
import { Layout } from "src/components";
import { getUser } from "src/utils";

const theme = createTheme({});

function App({ Component, pageProps }) {
  const [userResponse, setUserResponse] = useState({});
  const { error, user, noSession } = userResponse;

  // TODO: does error pop up here too?

  useEffect(() => {
    (async () => {
      const res = await getUser();
      setUserResponse(res);
    })();
  }, []);

  if (!user && !noSession) return <h1>Loading...</h1>;

  if (noSession) {
    return <h1>No session.</h1>;
  }

  return (
    <>
      <CssBaseline />
      <Head>
        {/* // TODO: pay attention to this, SEO is vital */}
        <title>Functional Player</title>
        <meta
          name="description"
          content="Functional Player"
          key="functional-player"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <Layout>
          <Component user={user} {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
