"use client";

import { useAppContext } from "@/context/AppContext";
import { badger } from "@/infra/badger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeStatus, UserBadge } from "@usebadger/sdk";
import Image from "next/image";
import { FaArrowDown, FaCheck } from "react-icons/fa";
import Code from "../Code";

function Branch({
  badge,
  disabled,
  isChild,
  onClick,
}: {
  badge: UserBadge;
  disabled: boolean;
  isChild: boolean;
  onClick: (badgeId: string) => void;
}) {
  return (
    <li className="flex flex-col gap-8 relative">
      {isChild && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <FaArrowDown className="text-gray-300" />
        </div>
      )}
      <button
        className="flex items-center flex-col md:flex-row justify-center gap-2 shadow-lg rounded-lg p-2 hover:brightness-95 group hover:bg-gray-50/50 cursor-pointer relative disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          onClick(badge.badgeId);
        }}
      >
        {badge.status === BadgeStatus.COMPLETE && (
          <div className="absolute inset-0 bg-green-200/25 rounded-lg flex justify-end items-end p-4">
            <FaCheck className="text-gray-300 text-2xl" />
          </div>
        )}
        <Image
          src={badge.imageUrl!}
          alt={badge.name}
          width={75}
          height={75}
          className="rounded-full shadow-md"
        />
        <div className="text-gray-700 text-center group-hover:text-gray-900">
          {badge.name}
        </div>
      </button>
      {badge.status === BadgeStatus.COMPLETE &&
        badge.children &&
        badge.children.length > 0 && (
          <ul className="flex gap-1 md:gap-8">
            {badge.children.map((child) => (
              <Branch
                key={child.badgeId}
                badge={child}
                disabled={badge.status !== BadgeStatus.COMPLETE}
                isChild={true}
                onClick={onClick}
              />
            ))}
          </ul>
        )}
    </li>
  );
}

export default function SkillTree() {
  const { userId } = useAppContext();

  const { data: rootBadge, refetch } = useQuery({
    queryKey: ["skill-tree", userId],
    queryFn: async () => {
      const root = await badger.users.getUserBadge(userId, "jump", {
        depth: 2,
        status: "all",
      });
      return root;
    },
  });

  const { mutate: grantBadge } = useMutation({
    mutationFn: async (badgeId: string) => {
      await fetch("/api/grant", {
        method: "POST",
        body: JSON.stringify({ userId, badgeId }),
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (!rootBadge) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 relative">
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Skill Tree
      </h2>
      <p className="text-gray-500 text-sm text-center">
        {"Create a skill tree with parent-child relationships."}
      </p>
      <h3 className="text-center font-semibold">Abilities</h3>
      <ul className="flex items-center gap-2 justify-center">
        <Branch
          badge={rootBadge}
          disabled={false}
          isChild={false}
          onClick={grantBadge}
        />
      </ul>
      <Code>{`
const badge = await badger.users.getUserBadge(
  "${userId}",
  "jump",
  {
    depth: 2, // or Infinity to get all children
    status: "all" // fetch badges with any status, defaults to skipping NOT_STARTED badges
  }
);

await badger.badges.awardBadge(
  "${userId}",
  "talon_trot"
);
      `}</Code>
    </div>
  );
}
