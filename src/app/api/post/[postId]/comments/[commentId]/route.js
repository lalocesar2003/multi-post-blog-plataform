import dbConnection from "@/database/dbConnection";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import PostModel from "@/models/post-model";

export const DELETE = async (req, { params }) => {
  try {
    await dbConnection();

    const { postId, commentId } = await params;

    if (!postId || !commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid access!",
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

    postData.comments = postData.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await postData.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Post comment delete failed : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
