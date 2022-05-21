// TODO: formdata must be fully validated before reaching this point

// types
export default async function subscribeHandler(formData) {
  const res = await fetch("/api/auth/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // TODO: is await required here?
  return res.json();
}
