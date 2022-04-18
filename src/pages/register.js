import { useState } from "react";
import { registerHandler } from "src/utils/registerHandler";

export default function Login() {
  const [formState, setFormState] = useState({});

  const { username, email, password } = formState;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { message, error } = await registerHandler({
      username,
      email,
      password,
    });

    if (!!error) {
      console.log("Status is NOT OK: ", error);
      return;
    }

    console.log("Message: ", message);
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
