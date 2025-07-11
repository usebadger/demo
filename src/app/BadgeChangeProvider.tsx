"use client";
import BadgeModal from "@/components/BadgeModal";
import { useBadgeQueue } from "@/lib/useBadgeQueue";
import { useEffect } from "react";

export default function BadgeChangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { badge, clearBadge } = useBadgeQueue();

  useEffect(() => {
    if (badge) {
      console.log("📱 BadgeChange detected in Home component:", badge);
    }
  }, [badge]);

  return (
    <>
      {!!badge && (
        <BadgeModal badge={badge} isOpen={true} onClose={clearBadge} />
      )}
      {children}
    </>
  );
}
