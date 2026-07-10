import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const response = NextResponse.json({
    status: true,
    message: "Logged out successfully"
  });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  return response;
}
