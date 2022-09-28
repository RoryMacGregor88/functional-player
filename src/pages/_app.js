import Head from "next/head";

import { useState, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { Layout, LoadMask, Toast, Dialog, VideoDialog } from "@/src/components";
import { http, Context } from "@/src/utils";

import theme from "@/src/components/theme";

function App({ Component, pageProps }) {
  const [ctx, setCtx] = useState({
    user: null,
    selectedVideo: null,
    dialogData: null,
    toastData: null,
  });

  const { user, toastData, dialogData, selectedVideo } = ctx;

  /** @param {object} newData */
  const updateCtx = (newData) => setCtx((prev) => ({ ...prev, ...newData }));

  // token is checked upon initial app request (not page navigations)
  const authenticateToken = async () => {
    try {
      const { user } = await http("/auth/authenticate-token", null, "GET");
      updateCtx({ user });
    } catch (error) {
      updateCtx({ user: null });
    }
  };

  useEffect(() => {
    authenticateToken();
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
