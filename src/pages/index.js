const Landing = ({ user }) => (
  <div style={{ width: "100%" }}>
    <h1>HOME PAGE</h1>
    {!!user ? (
      <h1>You are logged in as: {user.username}</h1>
    ) : (
      <h1>You are not logged in.</h1>
    )}
  </div>
);

export default Landing;
