"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

/*
This is a polling context that is used to trigger fast polling for 1 minute after a purchase.
There are potentially more elegant ways to do this, such as using a websocket or a server-sent event,
or using a library like react-query to handle cache invalidation, but this is a simple solution.
*/

interface PollingContextType {
  isFastPolling: boolean;
  remainingFastPollingTime: number;
  triggerFastPolling: () => void;
}

const PollingContext = createContext<PollingContextType | undefined>(undefined);

export function PollingProvider({ children }: { children: React.ReactNode }) {
  const [purchaseTimestamp, setPurchaseTimestamp] = useState<number | null>(
    null
  );
  const PURCHASE_BOOST_DURATION = 60000; // 1 minute in milliseconds

  const isFastPolling = Boolean(
    purchaseTimestamp &&
      Date.now() - purchaseTimestamp < PURCHASE_BOOST_DURATION
  );

  const remainingFastPollingTime = isFastPolling
    ? Math.ceil(
        (PURCHASE_BOOST_DURATION - (Date.now() - purchaseTimestamp!)) / 1000
      )
    : 0;

  const triggerFastPolling = useCallback(() => {
    setPurchaseTimestamp(Date.now());
    console.log(
      "🛒 Purchase detected - switching to fast polling for 1 minute"
    );
  }, []);

  return (
    <PollingContext.Provider
      value={{
        isFastPolling,
        remainingFastPollingTime,
        triggerFastPolling,
      }}
    >
      {children}
    </PollingContext.Provider>
  );
}

export function usePolling() {
  const context = useContext(PollingContext);
  if (context === undefined) {
    throw new Error("usePolling must be used within a PollingProvider");
  }
  return context;
}
