import PostModel from "@/models/post-model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  try {
    const { id } = await params;
    const body = await req.json();

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

    const post = await PostModel.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found!",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post update successfully.",
        post,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Error while update post : ${error.message}`,
    });
  }
};
