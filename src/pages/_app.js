import Head from "next/head";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Layout, LoadingSpinner } from "@/src/components";
import { getUser, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

import theme from "@/src/components/theme";

function App({ Component, pageProps }) {
  const [userResponse, setUserResponse] = useState({});
  const [error, setError] = useState(null);

  const { user, noSession } = userResponse;

  useEffect(() => {
    (async () => {
      try {
        const { user, noSession } = await getUser();
        setUserResponse({ user, noSession });
      } catch (error) {
        // TODO: what do if error fetching user? Old way might be better?
        setError({
          title: "Error",
          message: DEFAULT_ERROR_MESSAGE,
          stack: error,
        });
      }
    })();
  }, []);

  if (!user && !noSession) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        {/* // TODO: need one on every page once fleshed out, SEO is vital */}
        <title>Functional Player</title>
        <meta
          name="description"
          content="Functional Player"
          key="functional-player"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout user={user} clearUser={() => setUserResponse({})}>
          <Component user={user} {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
