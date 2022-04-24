// TODO: formdata must be fully validated before reaching this point

// TODO: This is no longer being used

/**
 * @param {{ email: string, password: string }} formData
 */
export default async function loginHandler(formData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
}
