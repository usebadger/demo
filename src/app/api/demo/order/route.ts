import { sdk } from "@/lib/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const orderData: {
      orderId: string;
      customerEmail: string;
      customerName: string;
      items: {
        id: number;
        name: string;
        price: number;
      }[];
      total: number;
      orderDate: string;
      status: string;
    } = await request.json();

    // Get userData from cookie
    const userDataCookie = request.cookies.get("userData")?.value;

    if (!userDataCookie) {
      return NextResponse.json(
        {
          success: false,
          message: "User data not found in cookie",
        },
        { status: 401 }
      );
    }

    // Parse userData to get userId
    let userData;
    try {
      userData = JSON.parse(decodeURIComponent(userDataCookie));
    } catch (error) {
      console.error("Error parsing user data cookie:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user data in cookie",
        },
        { status: 400 }
      );
    }

    const userId = userData.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not found in user data",
        },
        { status: 401 }
      );
    }

    // Log the order details (in a real app, you'd save to database)
    console.log("📦 New Order Received:", {
      orderId: orderData.orderId,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
      },
      items: orderData.items,
      total: orderData.total,
      date: orderData.orderDate,
      status: orderData.status,
    });

    for (const item of orderData.items) {
      await sdk.events.sendEvent({
        event: "purchase",
        userId,
        metadata: {
          productId: item.id.toString(),
          price: item.price.toString(),
        },
      });
    }

    await sdk.events.sendEvent({
      event: "order",
      userId,
      metadata: {
        total_items: orderData.items.length.toString(),
        total_price: orderData.total.toString(),
      },
    });

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Order received successfully",
      orderId: orderData.orderId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error processing order:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
