import { useRouter } from "next/router";

import { LoadMask } from "@/src/components";

//TODO: is this how to do this properly?

/** @param {{user: object}} props */
export default function NotFound({ user }) {
  const router = useRouter();
  router.push(!!user ? "/dashboard" : "/");
  return <LoadMask />;
}
