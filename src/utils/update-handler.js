/**
 * @param {{ email: string, password: string }} formData
 */
export default async function updateHandler({ formData }) {
  const res = await fetch("/api/auth/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
}
