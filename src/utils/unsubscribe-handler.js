/**
 * creates an inactive subscription on stripe servers
 * @param {object} formData
 */
export default async function unsubscribeHandler(formData) {
  const res = await fetch("/api/unsubscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return res.json();
}
