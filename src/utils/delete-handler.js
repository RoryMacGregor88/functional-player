/**
 * @param {{ email: string, password: string }} formData
 */
export default async function deleteHandler(formData) {
  const res = await fetch("/api/auth/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res.json();
}
