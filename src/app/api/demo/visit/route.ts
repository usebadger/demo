import { sdk } from "@/lib/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    await sdk.events.sendEvent({
      event: "visit",
      userId,
    });

    // Return success response
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("❌ Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process visit",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
