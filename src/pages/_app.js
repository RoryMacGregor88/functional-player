import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { Layout } from "src/components";

const theme = createTheme({});

function App({ Component, pageProps: { session, ...pageProps } }) {
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
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

export default App;
