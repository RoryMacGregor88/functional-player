// this object is defaults to be used in both API
// routes and `getServerSideProps` functions

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'functional-player-session',
  cookieOptions: {
    //maxAge goes here
    // http only?
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionOptions;
