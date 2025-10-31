// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("./workflows");
    else router.replace("./login");
  }, [user, loading, router]);

  return null;
}
