"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, initAuthFromStorage } from "@/lib/auth/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);

  React.useEffect(() => {
    // hydrate once on client
    const stored = initAuthFromStorage();
    hydrate(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // If accessing protected route without token
    const isAuthRoute = pathname?.startsWith("/login");
    if (!isAuthRoute && !token) {
      router.replace("/login");
    }
  }, [pathname, router, token]);

  return <>{children}</>;
}
