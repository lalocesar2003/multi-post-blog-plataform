import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/user-model";
import dbConnection from "@/database/dbConnection";

export const GET = async () => {
  try {
    await dbConnection();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid access!",
        },
        {
          status: 401,
        }
      );
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decode;

    const data = await UserModel.findById(userId).populate("data");

    if (!data) {
      return NextResponse.json(
        {
          message: "Data not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data found",
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error while getting mydata : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
