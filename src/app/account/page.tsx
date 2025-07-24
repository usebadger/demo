"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserDataFromCookie,
  UserData,
  getCartFromCookie,
  getOrderHistoryFromCookie,
  Order,
  clearUserDataCookie,
} from "../../lib/clientUtils";
import { useBadges } from "../../lib/useBadges";
import { useUser } from "../../lib/useUser";
import { useVisit } from "@/lib/useVisit";

export default function Account() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { badges, loading: badgesLoading, error: badgesError } = useBadges();
  const { user, loading: userLoading, error: userError } = useUser();

  // Only send visit event if user exists
  useVisit(userData);

  // Initialize user data, cart count, and order history on component mount
  useEffect(() => {
    const user = getUserDataFromCookie();

    if (!user) {
      // Redirect to home if no user exists
      router.push("/");
      return;
    }

    setUserData(user);

    // Get cart count from cookie
    const cart = getCartFromCookie();
    setCartCount(cart.length);

    // Get order history from cookie
    const orderHistory = getOrderHistoryFromCookie();
    setPurchases(orderHistory);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Clear user data from cookie
    clearUserDataCookie();
    // Redirect to home page
    router.push("/");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                ShopDemo
              </Link>
            </div>
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Store
              </Link>
              <Link
                href="/checkout"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Cart ({cartCount})
              </Link>
              <Link href="/account" className="text-blue-600 font-medium">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {userData
                    ? `${userData.firstName[0]}${userData.lastName[0]}`
                    : "..."}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData
                    ? `${userData.firstName} ${userData.lastName}`
                    : "Loading..."}
                </h1>
                <p className="text-gray-600">
                  {userData?.email || "Loading..."}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {userData?.memberSince || "Loading..."}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Log Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {purchases.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                $
                {purchases
                  .reduce((sum, order) => sum + order.total, 0)
                  .toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userLoading ? (
                  <span className="text-gray-400">...</span>
                ) : userError ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  user?.points || 0
                )}
              </div>
              <div className="text-sm text-gray-600">Reward Points</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Badges Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Badges Earned
            </h2>
            {badgesLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading badges...</div>
              </div>
            ) : badgesError ? (
              <div className="text-center py-8">
                <div className="text-red-500">
                  Error loading badges: {badgesError}
                </div>
              </div>
            ) : badges.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No badges earned yet. Start shopping to earn badges!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {badges
                  .slice()
                  .sort((a, b) => {
                    if (a.status === "COMPLETE") {
                      return -1;
                    }
                    if (b.status === "COMPLETE") {
                      return 1;
                    }
                    return 0;
                  })
                  .map((badge) => (
                    <div
                      key={badge.badgeId}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {badge.imageUrl ? (
                          <img
                            src={badge.imageUrl}
                            alt={badge.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-xl">🏆</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {badge.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {badge.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          {badge.status === "INCOMPLETE" &&
                          badge.conditions?.length === 1 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {badge.conditions[0].value} /{" "}
                                  {badge.conditions[0].target}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(badge.progress, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>Progress: {badge.progress}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(badge.progress, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          badge.status === "COMPLETE"
                            ? "bg-green-100 text-green-800"
                            : badge.status === "INCOMPLETE"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {badge.status === "COMPLETE"
                          ? "Earned"
                          : badge.status === "INCOMPLETE"
                          ? "In Progress"
                          : "Not Started"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* User Stats Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Stats
            </h2>
            {userLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading stats...</div>
              </div>
            ) : userError ? (
              <div className="text-center py-8">
                <div className="text-red-500">
                  Error loading stats: {userError}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Total Badges</h3>
                    <p className="text-sm text-gray-600">
                      Badges you&apos;ve earned
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {user?.badgeCount || 0}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Reward Points</h3>
                    <p className="text-sm text-gray-600">Points from badges</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {user?.points || 0}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">In Progress</h3>
                    <p className="text-sm text-gray-600">
                      Badges you&apos;re working on
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {user?.inProgressCount || 0}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Member Since</h3>
                    <p className="text-sm text-gray-600">When you joined</p>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Purchase History Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Purchase History
          </h2>
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Order {purchase.id}
                    </h3>
                    <p className="text-sm text-gray-600">{purchase.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ${purchase.total.toFixed(2)}
                    </div>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {purchase.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {purchase.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
