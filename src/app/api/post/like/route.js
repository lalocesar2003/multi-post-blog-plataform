import dbConnection from "@/database/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import PostModel from "@/models/post-model";

export const POST = async (req) => {
  try {
    await dbConnection();

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        {
          message: "Post id is required!",
          success: false,
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

    const post = await PostModel.findById(postId);

    if (!post) {
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

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: isLiked ? "Unlike post" : "Like post",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: `Error while like the post : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
