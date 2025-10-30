"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.role;
      const first = session?.clientIds?.[0];
      if (role === "admin") router.replace("/admin/clients");
      else if (first) router.replace(`/dashboard/${first}`);
      else router.replace("/signin");
    } else if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, session, router]);

  return null;
}

