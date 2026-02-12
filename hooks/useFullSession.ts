// lib/useFullSession.ts
"use client";

import { useEffect, useState } from "react";
import type { ExtendedUser } from "@/types/types";

type FullSession = {
  user: ExtendedUser;
};

export function useFullSession() {
  const [session, setSession] = useState<FullSession | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/session"); // we will create this endpoint
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    }
    fetchSession();
  }, []);

  return session;
}
