import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    maxAge: 0,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json(
    {
      success: true,
      message: "User logout successfully",
    },
    {
      status: 200,
    }
  );
};
