"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeStatus } from "@usebadger/sdk";
import Image from "next/image";
import Code from "../Code";

export default function Milestones() {
  const { userId } = useAppContext();

  const { data: badges, refetch } = useQuery({
    queryKey: ["milestones", userId],
    queryFn: async () => {
      const { badges } = await badger.users.getUserBadges(userId, {
        category: "Milestones",
        status: "ALL",
      });

      return Promise.all(
        badges.map(async (badge) => {
          const conditions = await badge.getConditions();

          return {
            ...badge,
            conditions,
          };
        })
      );
    },
  });

  const { mutate: sendEvent, isPending } = useMutation({
    mutationFn: () => {
      return fetch("/api/event", {
        method: "POST",
        body: JSON.stringify({
          userId,
          event: "run_completed",
          metadata: {
            distance: 1000,
          },
        }),
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const isFinished = badges?.some(
    (badge) =>
      badge.badgeId === "run_21km" && badge.status === BadgeStatus.COMPLETE
  );

  if (!badges) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 relative">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Milestones
      </h2>
      <p className="text-gray-500 text-sm text-center">
        {"Reward users for reaching specific milestones."}
      </p>
      <p className="text-gray-400 text-xs text-center">
        {"Link milestones together to create a feeling of progression."}
      </p>
      <ul className="grid grid-cols-2 gap-2 p-2">
        {badges.map((badge) => (
          <li
            key={badge.badgeId}
            className="bg-white p-2 rounded-lg shadow-md space-y-2"
          >
            <div className="flex flex-col items-center gap-2">
              <Image
                src={badge.imageUrl!}
                alt={badge.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">{badge.name}</h2>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${badge.progress}%` }}
                title={`${badge.conditions[0].value / 1000}km / ${
                  badge.conditions[0].target / 1000
                }km`}
              ></div>
            </div>
          </li>
        ))}
      </ul>
      {isFinished ? null : (
        <div className="flex justify-center">
          <button
            className="bg-green-200 px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
            onClick={() => sendEvent()}
          >
            {isPending ? "Adding..." : "Add 1km"}
          </button>
        </div>
      )}
      <Code>{`
const { badges } = await badger.users.getUserBadges(
  "${userId}",
  {
    category: "Milestones",
    status: "ALL",
  }
);

badger.events.sendEvent({
  userId: "${userId}",
  event: "run_completed",
  metadata: {
    distance: 1000,
  },
});
      `}</Code>
    </div>
  );
}
