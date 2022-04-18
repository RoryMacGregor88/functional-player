// TODO: formdata must be fully validated before reaching this point

/**
 * @param {{ username: string, email: string, password: string }} formData
 */
const registerHandler = async function (formData) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // TODO: is await required here?
  return res.json();
};

export { registerHandler };
