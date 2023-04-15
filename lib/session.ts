import { IronSessionOptions } from 'iron-session';

// this object is defaults to be used in both API
// routes and `getServerSideProps` functions

const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'functional-player-session',
  cookieOptions: {
    // TODO: must deal with expiration auto-destroying cookie.
    // We must be able to identify owner of cookie to clear
    // array on user in db

    // 30 days in seconds
    maxAge: 2592000,
    // httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionOptions;
