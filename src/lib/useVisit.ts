import { useEffect, useRef } from "react";
import { UserData } from "./clientUtils";

export function useVisit(user?: UserData | null) {
  const hasVisitedRef = useRef(false);

  useEffect(() => {
    // Only send visit event if user exists and we haven't already sent one
    if (user && !hasVisitedRef.current) {
      hasVisitedRef.current = true;

      // Send visit event
      fetch("/api/demo/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Visit event sent successfully");
          }
        })
        .catch((error) => {
          console.error("Failed to send visit event:", error);
        });
    }
  }, [user]);
}
