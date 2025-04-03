import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import PostModel from "@/models/post-model";
import UserModel from "@/models/user-model";

export const DELETE = async (req, { params }) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Id is not found",
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
          message: "Invalid access!",
        },
        {
          status: 401,
        }
      );
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decode;

    const post = await PostModel.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
          success: false,
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
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    user.data = user.data.filter((dataId) => dataId.toString() !== id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Post delete successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Error while delete post : ${error.message}`,
    });
  }
};
