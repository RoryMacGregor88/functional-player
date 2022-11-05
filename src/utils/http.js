export default async function http(endpoint, formData = null, method = "POST") {
  const options = !!formData ? { body: JSON.stringify(formData) } : {};
  return await (
    await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    })
  ).json();
}
