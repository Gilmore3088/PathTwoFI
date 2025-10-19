import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@shared/schema";

const AUTH_ENDPOINT = "/api/auth/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const fetchAuthState = useCallback(
    async (signal?: AbortSignal): Promise<User | null> => {
      if (!isMountedRef.current || signal?.aborted) {
        return null;
      }

      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(AUTH_ENDPOINT, {
          credentials: "include",
          signal,
        });

        if (signal?.aborted || !isMountedRef.current || requestId !== requestIdRef.current) {
          return null;
        }

        if (response.status === 401) {
          setUser(null);
          return null;
        }

        if (!response.ok) {
          const message = (await response.text()) || response.statusText;
          throw new Error(`${response.status}: ${message}`);
        }

        const data = (await response.json()) as User;
        setUser(data);
        return data;
      } catch (err) {
        const authError = err as Error;

        if (
          authError.name === "AbortError" ||
          signal?.aborted ||
          !isMountedRef.current ||
          requestId !== requestIdRef.current
        ) {
          return null;
        }

        setUser(null);
        setError(authError);
        return null;
      } finally {
        if (!(signal?.aborted || !isMountedRef.current || requestId !== requestIdRef.current)) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const refresh = useCallback(() => fetchAuthState(), [fetchAuthState]);

  useEffect(() => {
    const controller = new AbortController();
    isMountedRef.current = true;
    fetchAuthState(controller.signal);

    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, [fetchAuthState]);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    error,
    refresh,
  };
}
