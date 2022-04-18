// TODO: formdata must be fully validated before reaching this point

/**
 * @param {{ email: string, password: string }} formData
 */
const loginHandler = async function (formData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
};

export { loginHandler };
