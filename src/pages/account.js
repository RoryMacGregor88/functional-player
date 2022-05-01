import { useState } from "react";
import { useRouter } from "next/router";
import { updateHandler } from "src/utils";

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function Account({ user }) {
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);

  const { currentPassword, newPassword, confirmNewPassword } = formState;

  const onSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email: user.email,
      currentPassword,
      newPassword,
    };

    const { error, ok } = await updateHandler({ formData: userData });

    if (!!error) {
      console.log("error: ", error);
    }

    console.log("ok: ", ok);
  };

  const onChange = ({ target: { name, value } }) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  if (!user) {
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Edit account settings</h1>
      <input
        name="currentPassword"
        placeholder="Current password"
        value={currentPassword}
        onChange={onChange}
      />
      <input
        name="newPassword"
        placeholder="New password"
        value={newPassword}
        onChange={onChange}
      />
      <input
        name="confirmNewPassword"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={onChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
