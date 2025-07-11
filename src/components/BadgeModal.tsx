"use client";
import type { Badge } from "../lib/useBadges";
import { useEffect } from "react";

interface BadgeModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
  queueLength?: number;
}

export default function BadgeModal({
  badge,
  isOpen,
  onClose,
  queueLength = 0,
}: BadgeModalProps) {
  useEffect(() => {
    if (isOpen) {
      console.log("🎭 BadgeModal rendered:", {
        badge: badge.name,
        queueLength,
      });
    }
  }, [isOpen, badge, queueLength]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        {/* Queue indicator */}
        {queueLength > 0 && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {queueLength + 1}
          </div>
        )}

        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {badge.imageUrl ? (
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <span className="text-2xl">🏆</span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {"Badge Completed!"}
          </h2>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {badge.name}
          </h3>

          <p className="text-gray-600 mb-4">{badge.description}</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-800 font-medium">
              🎉 Congratulations! You&apos;ve earned this badge!
            </p>
          </div>

          {/* Queue message */}
          {queueLength > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                {queueLength} more badge{queueLength > 1 ? "s" : ""} waiting to
                be revealed!
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
        >
          {queueLength > 0 ? `Continue (${queueLength} more)` : "Awesome!"}
        </button>
      </div>
    </div>
  );
}
