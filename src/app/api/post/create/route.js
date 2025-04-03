import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/user-model";
import PostModel from "@/models/post-model";
import dbConnection from "@/database/dbConnection";

export const POST = async (req) => {
  try {
    await dbConnection();
    const body = await req.json();

    const { title, description, status } = body;

    if (!title || !description || !status) {
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

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize access!",
        },
        {
          status: 401,
        }
      );
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decode;

    const user = await UserModel.findById(userId);

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

    const post = await PostModel.create({
      title,
      description,
      status,
      userId: userId,
      author: user.name,
    });

    user.data.push(post._id);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      postdata: post,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: `Post creation failed : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
