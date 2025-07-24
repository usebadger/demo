"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getUserDataFromCookie,
  setUserDataCookie,
  generateRandomUserData,
  getCartFromCookie,
  setCartCookie,
  UserData,
} from "../lib/clientUtils";
import { products } from "../lib/products";
import { useBadges } from "../lib/useBadges";
import { useVisit } from "../lib/useVisit";

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { badges, loading: badgesLoading } = useBadges();

  // Only send visit event if user exists
  useVisit(user);

  // Initialize user data and cart on component mount
  useEffect(() => {
    const existingUser = getUserDataFromCookie();
    setUser(existingUser);

    // Initialize cart from cookie
    const savedCart = getCartFromCookie();
    setCart(savedCart);
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    const newUser = generateRandomUserData();
    setUserDataCookie(newUser);
    setUser(newUser);
  };

  const addToCart = (productId: number) => {
    const newCart = [...cart, productId];
    setCart(newCart);
    setCartCookie(newCart);
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

  // Show welcome screen if no user exists
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">ShopDemo</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to ShopDemo
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience our gamified shopping platform with badges, rewards,
              and personalized experiences. Click &ldquo;Get Started&rdquo; to
              begin your journey!
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Get Started
            </button>
            <p className="text-sm text-gray-500 mt-4">
              This will create a demo account for you to explore the features
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Show main app content when user exists
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ShopDemo</h1>
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
                Cart ({cart.length})
              </Link>
              <Link
                href="/account"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Discover amazing products at great prices
          </p>
        </div>

        {/* Badges Section */}
        {!badgesLoading && badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges
                .filter((b) => b.status === "COMPLETE")
                .slice(0, 4)
                .map((badge) => (
                  <div
                    key={badge.badgeId}
                    className="bg-white rounded-lg shadow-md p-4 text-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {badge.description}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
            {badges.length > 4 && (
              <div className="text-center mt-4">
                <Link
                  href="/account"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {badges.length} badges →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {product.category}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
