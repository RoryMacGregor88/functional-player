import React, { ReactElement, useState, useEffect } from 'react';

import Head from 'next/head';

import { AppProps } from 'next/app';

import { CssBaseline } from '@mui/material';

import { ThemeProvider } from '@mui/material/styles';

import {
  Layout,
  LoadMask,
  Toast,
  Dialog,
  VideoDialog,
  theme,
} from '@/src/components';

import { Context, authenticateToken } from '@/src/utils';

import { Ctx, UpdateCtx } from '@/src/utils/interfaces';

function App({ Component, pageProps }: AppProps): ReactElement {
  const [ctx, setCtx] = useState<Ctx>({
    selectedVideo: undefined,
    selectedCategory: undefined,
    dialogData: undefined,
    toastData: undefined,
    user: undefined,
  });

  const { user, toastData, dialogData, selectedVideo } = ctx;

  const updateCtx: UpdateCtx = (newData: Partial<Ctx>) =>
    setCtx((prev) => ({ ...prev, ...newData }));

  // token is checked upon initial app request (not internal page navigations)
  useEffect(() => {
    (async () => await authenticateToken({ updateCtx }))();
  }, []);

  // only a user object or null can ever be returned from server
  if (user === undefined) return <LoadMask />;

  // TODO: need one on every page once fleshed out, SEO is vital
  return (
    <>
      <Head>
        <title>Functional Player</title>
        <meta
          name='description'
          content='Functional Player'
          key='functional-player'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Context.Provider value={{ ctx, updateCtx }}>
          <Toast
            open={!!toastData}
            message={toastData?.message}
            severity={toastData?.severity}
            updateCtx={updateCtx}
          />
          <Dialog
            open={!!dialogData}
            updateCtx={updateCtx}
            title={dialogData?.title}
            message={dialogData?.message}
            actions={dialogData?.actions}
          />
          <VideoDialog
            open={!!selectedVideo}
            selectedVideo={selectedVideo}
            updateCtx={updateCtx}
          />
          <Layout>
            <Component user={user} updateCtx={updateCtx} {...pageProps} />
          </Layout>
        </Context.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
