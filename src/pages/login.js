import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Login() {
  const [user, setUser] = useState(undefined);
  const [formState, setFormState] = useState({});

  const { data: session, status } = useSession();
  console.log("session: ", session);
  console.log("status: ", status);

  const { email, password } = formState;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    console.log("res: ", res);

    if (!!res.error) {
      console.log("Error: ", res.error);
      return;
    }

    // need some kind of Provider for this. React context even?
    setUser(res.user);
  };

  const onChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

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
