import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    function checkAuth() {
      const token = localStorage.getItem("token")

      if(!token) router.replace("/sign-in")
    }

    checkAuth();
  }, [router]);
}
