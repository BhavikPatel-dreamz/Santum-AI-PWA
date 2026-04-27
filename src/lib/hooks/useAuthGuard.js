import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          router.replace("/sign-in");
          return;
        }

        const data = await res.json();

        if (!data.authenticated) {
          router.replace("/sign-in");
        }
      } catch {
        router.replace("/sign-in");
      }
    }

    checkAuth();
  }, [router]);
}
