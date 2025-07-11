import { useState, useEffect } from "react";
import type { User } from "@usebadger/sdk";
import { getUserDataFromCookie } from "./clientUtils";
import { sdk } from "./sdk";

export type { User };

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const userData = getUserDataFromCookie();

        if (!userData) {
          setError("User data not found in cookie");
          return;
        }

        const user = await sdk.users.getUser(userData.userId);

        setUser(user);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
