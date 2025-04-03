import UserModel from "@/models/user-model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnection from "@/database/dbConnection";

export const POST = async (req) => {
  try {
    await dbConnection();
    const body = await req.json();

    let { name, email, password } = body;

    name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
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

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This mail is already register!",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User Signup successfully.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `SignUp failed : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
