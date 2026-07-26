import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = auth(function GET(req) {
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  });
});