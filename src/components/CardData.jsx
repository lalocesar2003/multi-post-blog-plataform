import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ArrowUpRight,
  Edit,
  MessageSquareText,
  ThumbsUp,
  Trash,
} from "lucide-react";
import Link from "next/link";
import ReactTimeAgo from "react-timeago";
import axios from "axios";
import { toast } from "sonner";
import { UseMyContext } from "@/context/Provider";
import CommentInput from "./CommentInput";

const CardData = ({ post }) => {
  const {
    loginUserId,
    authToken,
    setUserPostData,
    setOpen,
    postDataUpdateId,
    setPostDataUpDateId,
    getPostData,
    showCommentInput,
    setShowCommentInput,
  } = UseMyContext();
  const handleDeletePost = async () => {
    try {
      const { data } = await axios.delete(`/api/post/delete/${post._id}`, {
        withCredentials: true,
      });

      if (data?.success) {
        toast.success(data?.message);
        getPostData();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const [likes, setLikes] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (!safeAuthToken && !safeLoginUserId) {
        toast.error("You need to login first!");
        return;
      }

      const { data } = await axios.post(
        "/api/post/like",
        { postId: post._id },
        {
          withCredentials: true,
        }
      );

      setIsLiked(!isLiked);
      setLikes(data.likes);
      getPostData();
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const safeAuthToken = authToken || "";
  const safeLoginUserId = loginUserId || "";

  const isLoginUserMatch =
    safeLoginUserId && post.userId
      ? String(safeLoginUserId) === String(post.userId)
      : false;

  const postTotoalComments = post?.comments?.length;

  const toggleCommentInput = (postId) => {
    if (!safeAuthToken || !safeLoginUserId) {
      toast.error("Necesitas iniciar session");
      return;
    }

    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    setIsLiked(post?.likes.includes(loginUserId));
  }, [post, loginUserId]);

  return (
    <Card
      className={`lg:p-2 flex flex-col gap-2 border-none shadow-xl hover:shadow-2xl hover:scale-105 transition duration-200 min-h-64 overflow-hidden ${
        post.status === "publish" ? "bg-white" : "bg-red-200"
      }`}
    >
      <CardHeader>
        <CardTitle className={"flex justify-between items-center"}>
          <h1 className="flex flex-col gap-1 capitalize text-sm">
            {post?.author}
            <Badge className={"text-[10px]"} variant={"ghost"}>
              <ReactTimeAgo date={post?.createdAt} />
            </Badge>
          </h1>

          {safeAuthToken && safeLoginUserId && isLoginUserMatch && (
            <div className="flex gap-2">
              <Button
                className={
                  "rounded-full flex justify-center items-center h-8 w-8 cursor-pointer bg-gray-300 text-black hover:text-white"
                }
                onClick={() => {
                  setOpen(true);
                  setUserPostData({
                    title: post.title,
                    description: post.description,
                    status: post.status,
                  });
                  setPostDataUpDateId(post._id);
                }}
              >
                <Edit />
              </Button>
              <Button
                className={
                  "rounded-full flex justify-center items-center h-8 w-8 cursor-pointer bg-red-300 text-black hover:bg-red-600 hover:text-white"
                }
                onClick={handleDeletePost}
              >
                <Trash />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-500 font-bold text-sm mb-3 line-clamp-1 capitalize">
          {post?.title}
        </p>

        <h5 className="line-clamp-4 text-justify tracking-tighter">
          {post?.description}
        </h5>
      </CardContent>

      <CardFooter className={"flex justify-between mt-5"}>
        <div className="flex gap-2 items-center">
          <Button
            className={`shadow-lg cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-gray-300 text-black hover:text-white ${
              isLiked ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={handleLike}
          >
            <ThumbsUp />
          </Button>
          <span className="font-bold">{likes > 0 ? likes : ""}</span>
          <Button
            className={
              "shadow-lg cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-gray-300 text-black hover:text-white"
            }
            onClick={() => toggleCommentInput(post._id)}
          >
            <MessageSquareText />
          </Button>
          <span className="font-bold">
            {postTotoalComments > 0 ? postTotoalComments : ""}
          </span>
        </div>
        <Link
          href={`/post/detailview/${post?._id}`}
          className={
            "shadow-lg cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-gray-300"
          }
        >
          <ArrowUpRight />
        </Link>
      </CardFooter>

      {showCommentInput[post._id] && (
        <div className="mt-2 px-2">
          <CommentInput postId={post._id} />
        </div>
      )}
    </Card>
  );
};

export default CardData;
