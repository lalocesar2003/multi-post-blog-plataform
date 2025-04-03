import dbConnection from "@/database/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async () => {
  try {
    await dbConnection();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Invalid access",
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decoded;

    return NextResponse.json(
      {
        success: true,
        message: "User id",
        id: userId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while getting user login id : ${error.message}`,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};
