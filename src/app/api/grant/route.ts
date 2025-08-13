import { NextRequest, NextResponse } from "next/server";
import { badger } from "@/infra/badger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badgeId } = body;

    // Validate required fields
    if (!userId || !badgeId) {
      return NextResponse.json(
        { error: "userId and badgeId are required" },
        { status: 400 }
      );
    }

    // Send event using badger client
    await badger.badges.awardBadge(userId, badgeId);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Error granting badge:", error);
    return NextResponse.json(
      { error: "Failed to grant badge" },
      { status: 500 }
    );
  }
}
