import Head from "next/head";

import { Elements } from "@stripe/react-stripe-js";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Layout, LoadingSpinner } from "@/src/components";
import { getUser, getStripe } from "@/src/utils";

import theme from "@/src/components/theme";

function App({ Component, pageProps }) {
  const stripePromise = getStripe();

  const [clientSecret, setClientSecret] = useState(null);

  const [userResponse, setUserResponse] = useState({});
  const [error, setError] = useState(null);

  const { user, noSession } = userResponse;

  useEffect(() => {
    (async () => {
      const { error, user, noSession } = await getUser();
      if (!!error) {
        // TODO: what do if error fetching user? Old way might be better?
        setError(error);
      } else {
        setUserResponse({ user, noSession });
      }
    })();
  }, []);

  if (!user && !noSession) return <LoadingSpinner />;

  return !stripePromise ? null : (
    <>
      <Head>
        {/* // TODO: need one on every page, SEO is vital */}
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
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <Layout user={user}>
            <Component
              user={user}
              setClientSecret={setClientSecret}
              {...pageProps}
            />
          </Layout>
        </Elements>
      </ThemeProvider>
    </>
  );
}

export default App;
