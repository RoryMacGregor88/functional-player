import { useState } from "react";
import { useRouter } from "next/router";
import { loginHandler } from "src/utils";

export default function Login({ user }) {
  const router = useRouter();
  const [formState, setFormState] = useState({});

  const { email, password } = formState;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, loggedIn } = await loginHandler({
      email: email,
      password: password,
    });

    if (!!error) {
      console.log("Error: ", error);
      return;
    }

    if (loggedIn) {
      router.push("/");
    }
  };

  const onChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  if (!!user) {
    // redirect to dashboard
  }

  return (
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
  );
}
