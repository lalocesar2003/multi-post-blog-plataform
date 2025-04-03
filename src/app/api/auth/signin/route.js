import UserModel from "@/models/user-model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnection from "@/database/dbConnection";

export const POST = async (req) => {
  try {
    await dbConnection();
    const body = await req.json();
    let { email, password } = body;

    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required!",
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found!",
        },
        {
          status: 404,
        }
      );
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Credential error!",
        },
        {
          status: 400,
        }
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookiStore = await cookies();
    cookiStore.set("token", token, {
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User Sign In Successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Sign in failed : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
