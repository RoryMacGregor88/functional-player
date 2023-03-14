import React, { ReactElement, useState, useEffect, useCallback } from 'react';

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

  const updateCtx: UpdateCtx = useCallback(
    (newData: Partial<Ctx>) => setCtx((prev) => ({ ...prev, ...newData })),
    []
  );

  // token is checked upon initial app request (not internal page navigations)
  useEffect(() => {
    (async () => await authenticateToken({ updateCtx }))();
  }, [updateCtx]);

  // only a user object or null can ever be returned from server
  if (user === undefined) return <LoadMask showLogo />;

  // TODO: need one on every page once fleshed out, SEO is vital
  // use Component.title trick: https://www.youtube.com/watch?v=R59e1Vl5lO8&list=WL&index=8&t=305s&ab_channel=LeeRobinson
  return (
    <>
      <Head>
        <title>FunctionalPlayer</title>
        <meta
          name='FunctionalPlayer'
          content='FunctionalPlayer'
          key='functional-player'
        />
        <link rel='icon' href='/fp-favicon.svg' />
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
            <Component
              user={user}
              ctx={ctx}
              updateCtx={updateCtx}
              {...pageProps}
            />
          </Layout>
        </Context.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
