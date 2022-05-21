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
  const [userResponse, setUserResponse] = useState({});
  const { error, user, noSession } = userResponse;

  useEffect(() => {
    (async () => {
      const res = await getUser();
      setUserResponse(res);
    })();
  }, []);

  if (!!error) {
    //handle error
    console.log("Error: ", error);
  }

  if (!user && !noSession) return <LoadingSpinner />;

  return (
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
        <Elements stripe={stripePromise}>
          <Layout user={user}>
            <Component user={user} {...pageProps} />
          </Layout>
        </Elements>
      </ThemeProvider>
    </>
  );
}

export default App;
