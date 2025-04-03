import dbConnection from "@/database/dbConnection";
import PostModel from "@/models/post-model";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnection();

    const post = await PostModel.find().sort({ createdAt: -1 });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post data not found!",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data found.",
        post,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error while getting post data : ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
};
