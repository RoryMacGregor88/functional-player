import Head from "next/head";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Layout, LoadMask, Toast, Dialog } from "@/src/components";
import { http, Context } from "@/src/utils";

import theme from "@/src/components/theme";

function App({ Component, pageProps }) {
  const [ctx, setCtx] = useState({});

  /** @param {object} newData */
  const updateCtx = (newData) => setCtx((prev) => ({ ...prev, ...newData }));

  // TODO: do something with error: 'Please reload page' or something
  // TODO: re-visit this, maybe a better way

  const fetchToken = async () => {
    try {
      const { user } = await http("/user", null, "GET");
      updateCtx(!!user ? { user } : { user: null });
    } catch (error) {
      updateCtx({ user: null });
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const { user, toastData, dialogData } = ctx;

  if (!user && user !== null) {
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
        <Context.Provider value={{ ctx, updateCtx }}>
          <Dialog
            open={!!dialogData}
            onClose={() => updateCtx({ dialogData: null })}
            title={dialogData?.title}
            message={dialogData?.message}
            actions={dialogData?.actions}
          />
          <Toast
            open={!!toastData}
            message={toastData?.message}
            severity={toastData?.severity}
            onClose={() => updateCtx({ toastData: null })}
          />
          <Layout user={user} fetchToken={fetchToken}>
            <Component user={user} fetchToken={fetchToken} {...pageProps} />
          </Layout>
        </Context.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
