import { useState } from "react";
import { registerHandler } from "src/utils/register-handler";

const RegisterForm = ({ insertedId, setInsertedId, onNextClick }) => {
  const [formState, setFormState] = useState({});

  const { username, email, password } = formState;

  const onChange = ({ target: { name, value } }) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, insertedId } = await registerHandler({
      username,
      email,
      password,
    });

    if (!!error) {
      console.log("There was an error: ", error);
      return;
    }

    setInsertedId(insertedId);
  };

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
        type="password"
      />
      <button type="submit" disabled={!!insertedId}>
        Submit
      </button>
      <button onClick={onNextClick} disabled={!insertedId}>
        Next
      </button>
    </form>
  );
};

export default RegisterForm;
