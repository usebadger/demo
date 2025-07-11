"use client";
import { useEffect, useRef, useState } from "react";
import { Badge, useBadges } from "./useBadges";

/*
This is a hook that is used to manage the badge queue.
When a new badge is unlocked, we want to show it to the user.
But if multiple badges are unlocked at the same time, we want to show one at a time.
*/

export function useBadgeQueue() {
  const nowRef = useRef<Date>(new Date());
  const [badgeQueue, setBadgeQueue] = useState<Badge[]>([]);
  const { badges } = useBadges();

  useEffect(() => {
    // Find badges that have been unlocked since the last time we checked
    const newBadges = badges.filter((badge) => {
      if (badge.status !== "COMPLETE") {
        return false;
      }

      if (!badge.unlockedAt || new Date(badge.unlockedAt) < nowRef.current) {
        return false;
      }

      return true;
    });

    if (newBadges.length > 0) {
      setBadgeQueue((prev) => [...prev, ...newBadges]);
      nowRef.current = new Date();
    }
  }, [badges]);

  // Get the first badge in the queue to show to the user
  const badge = badgeQueue[0];

  // Shift the first badge from the queue
  const clearBadge = () => {
    setBadgeQueue((prev) => prev.slice(1));
  };

  return { badge, clearBadge };
}
