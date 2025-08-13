"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeStatus } from "@usebadger/sdk";
import { FaCheck } from "react-icons/fa";
import Code from "../Code";

export default function Events() {
  const { userId } = useAppContext();

  const { data: userBadge, refetch } = useQuery({
    queryKey: ["events", userId],
    queryFn: () => {
      return badger.users.getUserBadge(userId, "button_clicker");
    },
  });

  const { mutate: sendEvent, isPending } = useMutation({
    mutationFn: () => {
      return fetch("/api/event", {
        method: "POST",
        body: JSON.stringify({
          userId,
          event: "button_clicked",
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
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 relative">
      <h2 className="text-xl font-bold text-gray-900 text-center">Events</h2>
      <p className="text-gray-500 text-sm text-center">
        {"Award badges when users perform specific actions."}
      </p>
      {userBadge.status === BadgeStatus.COMPLETE ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-8">
          <FaCheck className="text-green-500 text-4xl" />
          <p className="text-gray-600 text-center">{userBadge.description}</p>
        </div>
      ) : (
        <div className="flex-grow flex justify-center items-center">
          <button
            className="bg-red-600 rounded-full shadow-xl cursor-pointer text-white px-2 aspect-square font-bold hover:bg-red-700 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
            onClick={() => sendEvent()}
          >
            {isPending ? "Clicking..." : "Click Me"}
          </button>
        </div>
      )}
      <Code>{`
const badge = await badger.users.getUserBadge(
  "${userId}",
  "button_clicker"
);

badger.events.sendEvent({
  userId: "${userId}",
  event: "button_clicked"
});
      `}</Code>
    </div>
  );
}
