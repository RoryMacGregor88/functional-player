import Head from "next/head";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import {
  Layout,
  LoadMask,
  Toast,
  Dialog,
  VideoDialog,
  theme,
} from "@/src/components";
import { Context, authenticateToken } from "@/src/utils";

/**
 * @param {{
 *  Component: React.ReactNode,
 *  pageProps: object
 * }} props
 */
function App({ Component, pageProps }) {
  const [ctx, setCtx] = useState({
    selectedVideo: null,
    dialogData: null,
    toastData: null,
  });

  const { user, toastData, dialogData, selectedVideo } = ctx;

  /** @param {object} newData */
  const updateCtx = (newData) => setCtx((prev) => ({ ...prev, ...newData }));

  useEffect(() => {
    // token is checked upon initial app request (not internal page navigations)
    (async () => await authenticateToken(updateCtx))();
  }, []);

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
          <Toast
            open={!!toastData}
            message={toastData?.message}
            severity={toastData?.severity}
            onClose={() => updateCtx({ toastData: null })}
          />
          <Dialog
            open={!!dialogData}
            onClose={() => updateCtx({ dialogData: null })}
            title={dialogData?.title}
            message={dialogData?.message}
            actions={dialogData?.actions}
          />
          <VideoDialog
            open={!!selectedVideo}
            user={user}
            updateCtx={updateCtx}
            selectedVideo={selectedVideo}
            onClose={() => updateCtx({ selectedVideo: null })}
          />
          <Layout user={user}>
            <Component user={user} updateCtx={updateCtx} {...pageProps} />
          </Layout>
        </Context.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
