import dbConnection from "@/database/dbConnection";
import PostModel from "@/models/post-model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await dbConnection();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Id not found!",
        },
        {
          status: 400,
        }
      );
    }

    const post = await PostModel.findById(id);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Data not found!",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Data found",
        success: true,
        post,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while getting detail view post : ${error.message}`,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};
