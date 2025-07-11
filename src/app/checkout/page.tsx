"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getUserDataFromCookie,
  setUserDataCookie,
  generateRandomUserData,
  UserData,
  getCartFromCookie,
  setCartCookie,
  addOrderToHistory,
  Order,
} from "../../lib/clientUtils";
import { getProductById } from "../../lib/products";
import { useVisit } from "@/lib/useVisit";
import { usePolling } from "@/lib/PollingContext";

export default function Checkout() {
  useVisit();
  const { triggerFastPolling } = usePolling();
  const [promiseToPay, setPromiseToPay] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cartItems, setCartItems] = useState<
    { productId: number; quantity: number }[]
  >([]);

  // Initialize user data and cart on component mount
  useEffect(() => {
    let user = getUserDataFromCookie();

    if (!user) {
      user = generateRandomUserData();
      setUserDataCookie(user);
    }

    setUserData(user);

    // Get cart from cookie and convert to cart items format
    const cart = getCartFromCookie();
    const cartItemMap = new Map<number, number>();

    cart.forEach((productId) => {
      cartItemMap.set(productId, (cartItemMap.get(productId) || 0) + 1);
    });

    const items = Array.from(cartItemMap.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );

    setCartItems(items);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (promiseToPay) {
      // Create order from current cart
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const orderDate = new Date().toISOString().split("T")[0];

      const orderItems = cartItems.map((item) => {
        const product = getProductById(item.productId);
        return {
          id: product?.id || 0,
          name: product?.name || "Unknown Product",
          quantity: item.quantity,
          price: (product?.price || 0) * item.quantity,
        };
      });

      const order: Order = {
        id: orderId,
        userId: userData?.userId || "",
        date: orderDate,
        total: total,
        status: "Delivered",
        items: orderItems,
      };

      // Add order to history and empty cart
      addOrderToHistory(order);
      setCartCookie([]);

      // Call demo API with order details
      try {
        const response = await fetch("/api/demo/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            customerEmail: userData?.email,
            customerName: userData
              ? `${userData.firstName} ${userData.lastName}`
              : "Unknown",
            items: orderItems,
            total: order.total,
            orderDate: order.date,
            status: order.status,
          }),
        });

        if (response.ok) {
          console.log("Order sent to demo API successfully");
          triggerFastPolling(); // Trigger fast polling after successful purchase
        } else {
          console.error("Failed to send order to demo API");
        }
      } catch (error) {
        console.error("Error sending order to demo API:", error);
      }

      setOrderComplete(true);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  ShopDemo
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We&apos;ll send you a reminder to pay
              later.
            </p>
            <Link
              href="/account"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Account
            </Link>
          </div>
        </main>
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
              <Link href="/checkout" className="text-blue-600 font-medium">
                Cart ({cartItems.length})
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Complete Your Order
            </h2>

            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {userData?.email || "Loading..."}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {userData
                        ? `${userData.firstName} ${userData.lastName}`
                        : "Loading..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                      {userData?.address.street || "Loading..."}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {userData?.address.city || "Loading..."}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {userData?.address.zipCode || "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Promise */}
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="promise-to-pay"
                    checked={promiseToPay}
                    onChange={(e) => setPromiseToPay(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <label
                      htmlFor="promise-to-pay"
                      className="text-sm font-medium text-gray-900"
                    >
                      I promise to pay for this order later
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      By checking this box, you agree to pay the total amount of
                      ${total.toFixed(2)} at a later date. We&apos;ll send you a
                      reminder email with payment instructions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleCheckout}
                disabled={!promiseToPay}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  promiseToPay
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Place Order - ${total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
