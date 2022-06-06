import { useRouter } from "next/router";

export default function RegistrationSuccess({ user }) {
  const router = useRouter();

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <p>Thank you, your subscription was successful.</p>
      <p>
        You can access your account information by clicking the{" "}
        <span style={{ fontWeight: "bold" }}>My Account</span> button in the
        sidebar.
      </p>
      <button
        style={{ padding: "0.5rem 1rem" }}
        onClick={() => router.push("/login")}
      >
        Login
      </button>
    </div>
  );
}
