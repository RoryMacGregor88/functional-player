import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

import Head from "next/head";
import { Layout } from "src/components";

const theme = createTheme({});

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    console.log("HIT withIronSessionSsr");
    const user = req.session.user;

    return {
      props: {
        user: user ?? null,
      },
    };
  },
  sessionOptions
);

function App({ Component, pageProps: { user, ...pageProps } }) {
  console.log("user: ", user);
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

      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
