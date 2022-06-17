import Head from "next/head";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Layout, LoadMask } from "@/src/components";
import { http, DEFAULT_ERROR_MESSAGE } from "@/src/utils";

import theme from "@/src/components/theme";

function App({ Component, pageProps }) {
  const [userResponse, setUserResponse] = useState({});

  const { user, noSession } = userResponse;

  // TODO: do something with error: 'Please reload page' or something
  // TODO: re-visit this, maybe a better way

  useEffect(() => {
    (async () => {
      try {
        const { user, noSession } = await http("/user", null, "GET");
        setUserResponse({ user, noSession });
      } catch (error) {
        // TODO: what do if error fetching user? Old way might be better?
        setUserResponse({ noSession: true });
      }
    })();
  }, []);

  if (!user && !noSession) {
    return <LoadMask />;
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
