"use client";

import { useAppContext } from "@/context/AppContext";

export default function Header() {
  const { userId, setUserId } = useAppContext();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-900">Badger Demo</h1>
          <div className="flex items-center gap-2">
            <label
              htmlFor="userId"
              className="text-xs text-gray-500 flex-shrink-0"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="w-full p-1 border-transparent rounded-md text-xs"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
