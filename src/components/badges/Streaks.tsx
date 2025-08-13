"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeStatus } from "@usebadger/sdk";
import { FaCheck, FaGlassWater } from "react-icons/fa6";
import Code from "../Code";

export default function Streaks() {
  const { userId } = useAppContext();

  const { data: userBadge, refetch } = useQuery({
    queryKey: ["streaks", userId],
    queryFn: async () => {
      const badge = await badger.users.getUserBadge(userId, "keep_hydrated");
      const conditions = await badge.getConditions();

      return {
        ...badge,
        conditions,
      };
    },
  });

  const { mutate: sendEvent, isPending } = useMutation({
    mutationFn: () => {
      return fetch("/api/event", {
        method: "POST",
        body: JSON.stringify({
          userId,
          event: "sip",
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

  const current = userBadge.conditions[0].value;
  const target = userBadge.conditions[0].target;
  const best = userBadge.conditions[0].bestStreak ?? 0;
  const lastEventTimestamp = userBadge.conditions[0].lastEventTimestamp;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 relative">
      <h2 className="text-xl font-bold text-gray-900 text-center">Streaks</h2>
      <p className="text-gray-500 text-sm text-center">
        {"Reward users for maintaining a streak of actions over time."}
      </p>
      <div className="space-y-2">
        <h3 className="text-center font-semibold">{userBadge.name}</h3>
        <p className="text-gray-700 text-sm text-center">
          {userBadge.description}
        </p>
        <ul className="grid grid-cols-5 gap-2">
          {Array.from({ length: target }).map((_, index) => (
            <li
              key={index}
              className={`p-2 rounded-md shadow  flex justify-center items-center aspect-square ${
                index < best ? "bg-blue-50/50" : ""
              }`}
              title={
                index === current - 1
                  ? "Current streak"
                  : index === best - 1
                  ? "Best streak"
                  : ""
              }
            >
              {index < current ? (
                <FaGlassWater className="text-blue-400 rotate-12 text-lg" />
              ) : (
                <FaGlassWater className="text-gray-300 text-lg" />
              )}
            </li>
          ))}
        </ul>
        {lastEventTimestamp && (
          <p className="text-gray-500 text-xs text-center mt-4">
            {`Last sip: ${new Date(lastEventTimestamp).toLocaleTimeString(
              "en-US",
              { hour: "2-digit", minute: "2-digit" }
            )}`}
          </p>
        )}
        <div className="flex justify-center mt-4">
          {userBadge.status === BadgeStatus.COMPLETE ? (
            <div className="flex items-center justify-center gap-2">
              <FaCheck className="text-green-500 text-xl" />
            </div>
          ) : (
            <button
              disabled={isPending}
              className="px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer hover:bg-blue-50"
              onClick={() => sendEvent()}
            >
              <FaGlassWater className="text-blue-600 rotate-12 text-lg" />
              <span className="text-sm text-blue-600">
                {isPending ? "Sipping..." : "Sip"}
              </span>
            </button>
          )}
        </div>
      </div>
      <Code>{`
const badge = await badger.users.getUserBadge(
  "${userId}",
  "keep_hydrated"
);
const { conditions } = await badge.getConditions();
const { value, target, bestStreak } = conditions[0];

badger.events.sendEvent({
  userId: "${userId}",
  event: "sip",
});
      `}</Code>
    </div>
  );
}
