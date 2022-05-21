import { useRouter } from "next/router";
import { Button } from "@/src/components";

const RegistrationFinishView = () => {
  const router = useRouter();
  return (
    <div>
      <p style={{ textAlign: "center" }}>You are finished.</p>
      <Button onClick={() => router.push("/login")}>
        Click here to log in
      </Button>
    </div>
  );
};

export default RegistrationFinishView;
