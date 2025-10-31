// app/layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function AuthGate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return;
    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    if (!user && !isAuthRoute) {
      router.replace({ pathname: "./login" });
    }
    if (user && isAuthRoute) {
      router.replace({ pathname: "./workflows" });
    }
  }, [user, loading, pathname, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <AuthGate />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}
