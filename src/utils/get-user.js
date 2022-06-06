export default async function getUser() {
  // TODO: must use env variable here?
  const res = await fetch(`${process.env.BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}
