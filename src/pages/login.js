import { useState } from "react";
import { loginHandler } from "src/utils/login-handler";

export default function Login() {
  const [user, setUser] = useState(undefined);
  const [formState, setFormState] = useState({});

  const { email, password } = formState;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { user, error } = await loginHandler({
      email,
      password,
    });

    if (error) {
      console.log("Status is NOT OK: ", error);
      return;
    }

    // need some kind of Provider for this. React context even?
    setUser(user);
  };

  const onChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  return (
    <>
      <h1>Username is: {user?.username}</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
        />
        <input
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
