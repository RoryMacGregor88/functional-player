import { useRouter } from "next/router";

//TODO: is this how to do this properly?
export default function NotFound({ user }) {
  const router = useRouter();
  router.push(!!user ? "/dashboard" : "/");
  return null;
}
