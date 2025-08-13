import { NextRequest, NextResponse } from "next/server";
import { badger } from "@/infra/badger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, event, metadata } = body;

    // Validate required fields
    if (!userId || !event) {
      return NextResponse.json(
        { error: "userId and event are required" },
        { status: 400 }
      );
    }

    // Send event using badger client
    const result = await badger.events.sendEvent({
      userId,
      event,
      metadata: metadata || {},
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error sending event:", error);
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }
}
