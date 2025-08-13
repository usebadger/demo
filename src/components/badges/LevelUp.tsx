"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeStatus } from "@usebadger/sdk";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import Code from "../Code";

export default function LevelUp() {
  const { userId } = useAppContext();

  const { data: userBadge, refetch } = useQuery({
    queryKey: ["level-up", userId],
    queryFn: () => {
      return badger.users.getUserBadge(userId, "complete_lessons");
    },
  });

  const { mutate: sendEvent, isPending } = useMutation({
    mutationFn: () => {
      return fetch("/api/event", {
        method: "POST",
        body: JSON.stringify({ userId, event: "lesson_complete" }),
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
      <h2 className="text-xl font-bold text-gray-900 text-center">Level Up</h2>
      <p className="text-gray-500 text-sm text-center">
        {"Create ongoing badges that evolve as users progress."}
      </p>
      <div className="space-y-2">
        {userBadge.status === BadgeStatus.COMPLETE && (
          <div className="flex items-center justify-center gap-2">
            {userBadge.imageUrl && (
              <Image
                src={userBadge.imageUrl}
                alt={userBadge.name}
                width={100}
                height={100}
                className="rounded-full shadow-md"
              />
            )}
            <h3 className="text-center font-semibold text-lg">
              {userBadge.description}
            </h3>
          </div>
        )}

        {userBadge.next && (
          <div className="max-w-64 mx-auto space-y-2 mt-8">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-500 text-sm">Next up:</span>
              <span className="text-gray-700 text-sm">
                {userBadge.next.name}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${userBadge.next.progress}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {userBadge.current?.badgeId === "complete_lessons_3" ? null : (
        <div className="flex justify-center mt-8">
          <button
            className="bg-green-200 px-4 py-2 rounded-md shadow-md flex items-center gap-2 cursor-pointer hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
            onClick={() => sendEvent()}
          >
            <FaCheck />
            <span>{isPending ? "Completing..." : "Complete Lesson"}</span>
          </button>
        </div>
      )}
      <Code>{`
const badge = await badger.users.getUserBadge(
  "${userId}",
  "complete_lessons"
);
const {
  current, // The furthest-unlocked child badge
  next // The next badge to unlock
} = badge;

badger.events.sendEvent({
  userId: "${userId}",
  event: "lesson_complete",
});
      `}</Code>
    </div>
  );
}
