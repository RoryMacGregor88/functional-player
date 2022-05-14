import { useRouter } from "next/router";

export default function Dashboard({ user }) {
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return !!user ? (
    <div>
      <h1>Dashboard</h1>
      <h1>Logged in as: {user.username}</h1>
    </div>
  ) : null;
}
