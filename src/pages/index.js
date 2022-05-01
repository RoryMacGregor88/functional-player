import Link from "next/link";
import { logoutHandler } from "src/utils";

const Landing = ({ user }) =>
  !!user ? (
    <div>
      <h1>You are logged in as: {user.username}</h1>
      <button onClick={logoutHandler}>Click to logout</button>
    </div>
  ) : (
    <div>
      <h1>You are logged out.</h1>
      <Link href="/login" passHref>
        <button>Click to login</button>
      </Link>
    </div>
  );

export default Landing;
