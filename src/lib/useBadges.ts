"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { UserBadge, UserBadgeCondition } from "@usebadger/sdk";
import { sdk } from "./sdk";
import { getUserDataFromCookie } from "./clientUtils";
import { usePolling } from "./PollingContext";

export type Badge = UserBadge & {
  conditions: UserBadgeCondition[];
};

const FAST_POLLING_INTERVAL = 5000; // 5 seconds
const SLOW_POLLING_INTERVAL = 300000; // 5 minutes

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousBadgesRef = useRef<Badge[]>([]);
  const isInitialLoadRef = useRef(true);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isFastPolling, remainingFastPollingTime } = usePolling();

  const getCurrentPollingInterval = useCallback(() => {
    if (isFastPolling) {
      console.log(
        `🚀 Fast polling active - ${remainingFastPollingTime}s remaining`
      );
      return FAST_POLLING_INTERVAL;
    }
    console.log("🐌 Slow polling active (5 minutes)");
    return SLOW_POLLING_INTERVAL;
  }, [isFastPolling, remainingFastPollingTime]);

  const fetchBadges = useCallback(async () => {
    try {
      // Only set loading to true on initial load
      if (isInitialLoadRef.current) {
        setLoading(true);
      }
      setError(null);

      const userData = getUserDataFromCookie();

      if (!userData) {
        setError("User data not found in cookie");
        return;
      }

      const { badges } = await sdk.users.getUserBadges(userData.userId, {
        status: "all",
      });
      const newBadges = await Promise.all(
        badges.map(async (badge) => ({
          ...badge,
          conditions: await badge.getConditions(),
        }))
      );

      // Update badges state with new data
      setBadges(newBadges);
      previousBadgesRef.current = newBadges;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch badges");
    } finally {
      setLoading(false);
      isInitialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchBadges();

    // Set up dynamic polling
    const setupPolling = () => {
      // Clear existing interval
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      const interval = getCurrentPollingInterval();
      console.log(`🔄 Setting up polling with ${interval}ms interval`);

      intervalIdRef.current = setInterval(() => {
        fetchBadges();
      }, interval);
    };

    setupPolling();

    // Cleanup interval on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [fetchBadges, getCurrentPollingInterval, isFastPolling]);

  return {
    badges,
    loading,
    error,
  };
}
