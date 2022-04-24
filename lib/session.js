// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "functional-player-session",
  cookieOptions: {
    //maxAge goes here
    // http only?
    secure: process.env.NODE_ENV === "production",
  },
};
