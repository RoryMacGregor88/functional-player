import { IronSessionOptions } from 'iron-session';

/**
 * this object is defaults to be used in both API
 * routes and `getServerSideProps` functions
 */
const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'functional-player-session',
  /** default time-to-live to 70 years */
  ttl: 0,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionOptions;
