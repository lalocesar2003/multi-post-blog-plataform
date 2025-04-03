import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import PostModel from "@/models/post-model";
import UserModel from "@/models/user-model";
import dbConnection from "@/database/dbConnection";

export const POST = async (req) => {
  try {
    await dbConnection();
    const body = await req.json();
    const { comment, postId } = body;

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Input field is empty!",
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

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decoded;

    const postData = await PostModel.findById(postId);

    if (!postData) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }

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

    postData.comments.push({
      user: user.name,
      text: comment,
    });

    await postData.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Comment failed : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
