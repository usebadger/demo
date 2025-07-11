import { useEffect, useRef } from "react";

export function useVisit() {
  const hasVisitedRef = useRef(false);

  useEffect(() => {
    // Send visit event on every page load/refresh
    // The useRef prevents duplicate calls during the same render cycle
    if (!hasVisitedRef.current) {
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
  }, []);
}
