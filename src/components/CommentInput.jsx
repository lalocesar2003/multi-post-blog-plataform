"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UseMyContext } from "@/context/Provider";
import axios from "axios";
import { toast } from "sonner";

const CommentInput = ({ postId }) => {
  const [comment, setComment] = useState("");

  const { setShowCommentInput, getPostData } = UseMyContext();

  const onChangeHandler = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "/api/post/comment",
        { comment, postId },
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        setComment("");
        toast.success(data?.message);
        setShowCommentInput(true);
        getPostData();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <form onSubmit={handleSubmitComment}>
      <Input
        type="text"
        placeholder="Comment"
        name="comment"
        value={comment.comment}
        onChange={onChangeHandler}
      />
      <Button
        className={"text[10px] font-bold mt-2 cursor-pointer px-2"}
        type="submit"
      >
        Add Comment
      </Button>
    </form>
  );
};

export default CommentInput;
