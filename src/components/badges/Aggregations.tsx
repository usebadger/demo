"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeConditionType, BadgeStatus } from "@usebadger/sdk";
import { FaCheck, FaStar } from "react-icons/fa";
import Code from "../Code";
import { useState } from "react";

export default function Aggregations() {
  const { userId } = useAppContext();
  const [lastRating, setLastRating] = useState<number>(4);

  const { data: userBadge, refetch } = useQuery({
    queryKey: ["aggregations", userId],
    queryFn: async () => {
      const badge = await badger.users.getUserBadge(userId, "trusted_seller");
      const conditions = await badge.getConditions();
      return {
        ...badge,
        conditions,
      };
    },
  });

  const { mutate: sendEvent, isPending } = useMutation({
    mutationFn: ({ rating }: { rating: number }) => {
      return fetch("/api/event", {
        method: "POST",
        body: JSON.stringify({
          userId,
          event: "review",
          metadata: {
            rating,
          },
        }),
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (!userBadge) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 relative">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Aggregations
      </h2>
      <p className="text-gray-500 text-sm text-center">
        {"Sum, count, average, and more."}
      </p>
      <div className="space-y-2">
        <h3 className="text-center font-semibold">{userBadge.name}</h3>
        <p className="text-gray-700 text-sm text-center">
          {userBadge.description}
        </p>
        <dl className="space-y-2">
          {userBadge.conditions
            .slice()
            .sort((a, b) => {
              return a.type.localeCompare(b.type);
            })
            .map((condition, i) => {
              const { id, type, value, target, progress } = condition;
              let label = "";
              switch (type) {
                case BadgeConditionType.COUNT:
                  label = "Reviews";
                  break;
                case BadgeConditionType.AVERAGE:
                  label = "Rating";
                  break;
                case BadgeConditionType.SUM:
                  label = "Total";
              }

              return (
                <div key={id || i} className="flex items-center gap-4">
                  <dt className="text-gray-500 w-32 text-sm">{label}</dt>
                  <dd className="flex-grow flex flex-col gap-2">
                    <div className="text-gray-500 text-sm text-center">
                      {value}/{target}
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </dd>
                </div>
              );
            })}
        </dl>
      </div>
      {userBadge.status === BadgeStatus.COMPLETE ? (
        <div className="flex items-center justify-center gap-2 mt-8">
          <FaCheck className="text-green-500 text-xl" />
        </div>
      ) : (
        <div className="space-y-2 mt-8">
          <h4 className="text-center font-semibold">Rate</h4>
          <div className="flex items-center gap-2 justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                className="text-2xl cursor-pointer hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
                onClick={() => {
                  setLastRating(index + 1);
                  sendEvent({ rating: index + 1 });
                }}
              >
                <FaStar />
              </button>
            ))}
          </div>
        </div>
      )}
      <Code>{`
const badge = await badger.users.getUserBadge(
  "${userId}",
  "trusted_seller"
);
const conditions = await badge.getConditions();

badger.events.sendEvent({
  userId: "${userId}",
  event: "review",
  metadata: {
    rating: ${lastRating},
  },
});
      `}</Code>
    </div>
  );
}
