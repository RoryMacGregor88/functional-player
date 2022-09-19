export default async function http(endpoint, formData = null, method = "POST") {
  const options = !!formData ? { body: JSON.stringify(formData) } : {};
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  return res.json();
}
