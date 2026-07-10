import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "fallback-secret-for-dev";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Missing Google token" },
        { status: 400 }
      );
    }

    // Verify the Google ID token via Google's tokeninfo endpoint
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    if (!googleRes.ok) {
      return NextResponse.json(
        { status: false, message: "Invalid Google token" },
        { status: 401 }
      );
    }

    const payload = await googleRes.json();

    // Verify the token was issued for our app
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { status: false, message: "Token was not issued for this application" },
        { status: 401 }
      );
    }

    const { email, name } = payload;

    if (!email) {
      return NextResponse.json(
        { status: false, message: "No email in Google token" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create user — Google has already verified their email
      user = await prisma.user.create({
        data: {
          email,
          username: name || email.split("@")[0],
          isVerified: true,
        },
      });
    } else if (!user.isVerified) {
      // Existing user signing in via Google — mark as verified
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    // Generate JWT
    const authToken = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      status: true,
      message: "Logged in with Google successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google Login error:", error);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

