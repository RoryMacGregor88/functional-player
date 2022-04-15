import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [formState, setFormState] = useState({});

  const { username, email, password } = formState;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { status, error } = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (error) {
      console.log("Status is NOT OK: ", error);
      // return setServerError(error);
    } else {
      console.log("Status is OK: ", status);
    }
  };

  const onChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Username"
        name="username"
        value={username}
        onChange={onChange}
      />
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
  );
}
