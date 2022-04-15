export default async function registerHandler(formData) {
  const { email, username, password } = formData;

  //TODO: will validation make this unneeded?
  if (!email || !email.includes("@") || !password || !username) {
    return { error: "Invalid Data" };
  }

  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.error) {
    return { error: data.error };
  } else if (data.ops) {
    return data?.ops[0];
  }
}
