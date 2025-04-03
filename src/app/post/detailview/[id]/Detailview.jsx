"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UseMyContext } from "@/context/Provider";
import axios from "axios";
import { Loader, TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeAgo from "react-timeago";
import { toast } from "sonner";

const Detailview = () => {
  const router = useRouter();
  const { loading, setLoading, authToken, loginUserId } = UseMyContext();
  const { id } = useParams();
  const [detailViewData, setDetailViewData] = useState();

  const isLoginUserMatch = detailViewData?.post?.userId === loginUserId;

  const getDetailViewPost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/post/detailview/${id}`);
      if (data?.success) {
        setDetailViewData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const { data } = await axios.delete(
        `/api/post/${postId}/comments/${commentId}`,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success(data?.message);
        setDetailViewData((prev) => ({
          ...prev,
          post: {
            ...prev.post,
            comments: prev.post.comments.filter(
              (comment) => comment._id !== commentId
            ),
          },
        }));
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getDetailViewPost();
  }, []);

  return (
    <div className="pt-28 px-5 md:px-10">
      <div>
        <Button
          onClick={() => router.push("/")}
          variant={"outline"}
          className={"cursor-pointer"}
        >
          Back
        </Button>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center h-1/2">
            <Loader className="h-14 w-14 animate-spin" />
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs">Published by :</span>
                <h4 className="font-bold text-sm uppercase">
                  {detailViewData?.post?.author}
                </h4>
              </div>

              <div>
                <ReactTimeAgo
                  className="text-[12px] font-bold"
                  date={detailViewData?.post?.createdAt}
                />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-bold uppercase">
                {detailViewData?.post?.title}
              </h3>
              <p className="text-md font-light">
                {detailViewData?.post?.description}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-md md:text-lg font-bold mb-3">Comments</h3>

              <div className="flex gap-5">
                {detailViewData?.post?.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white rounded-lg min-w-28 p-2 gap-5"
                  >
                    <div className="flex items-center justify-center gap-5">
                      <Badge>{comment?.user}</Badge>

                      <ReactTimeAgo
                        className="text-[12px] font-bold"
                        date={comment?.createdAt}
                      />
                    </div>

                    <p className="my-3">{comment?.text}</p>

                    {authToken && isLoginUserMatch && (
                      <Button
                        className="bg-red-400 cursor-pointer w-8 h-8 hover:bg-red-600 hover:text-white transition-all duration-200"
                        onClick={() => deleteComment(id, comment._id)}
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detailview;
