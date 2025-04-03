"use client";
import CardData from "@/components/CardData";
import DataSkeleton from "@/components/DataSkeleton";
import { UseMyContext } from "@/context/Provider";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyData = () => {
  const { loading, setLoading, postData } = UseMyContext();

  const [myData, setMyData] = useState();

  const getMyData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/mydata", {
        withCredentials: true,
      });
      if (data?.success) {
        setMyData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const posts = myData?.data?.data || [];
  const isMyDataIsAvaible = Array.isArray(posts) && posts.length > 0;

  const publishPost = posts.filter((post) => post.status === "publish");
  const draftPost = posts.filter((post) => post.status === "draft");
  useEffect(() => {
    getMyData();
  }, [postData]);
  return (
    <div className="pt-24 pb-10 px-10">
      <div className="bg-white rounded-lg w-full md:w-1/2 text-black p-5 font-bold border-r-8 border-r-orange-600 shadow-lg">
        <h1>Data Overview</h1>
      </div>

      <div className="flex gap-2 md:gap-5 flex-wrap justify-center md:justify-start">
        {/*Published post box */}
        <div className="h-28 w-40 bg-[#10ac84] border-2 border-gray-300 rounded-4xl mt-5 shadow-2xl flex flex-col justify-center items-center">
          <h1 className="text-md font-medium text-gray-800">Published Posts</h1>
          <h3>{publishPost.length}</h3>
        </div>

        <div className="h-28 w-40 bg-[#ff6348] border-2 border-gray-300 rounded-4xl mt-5 shadow-2xl flex flex-col justify-center items-center">
          <h1 className="text-md font-medium text-gray-800">Draft Posts</h1>
          <h3>{draftPost.length}</h3>
        </div>

        <div className="h-28 w-40 bg-[#2e86de] border-2 border-gray-300 rounded-4xl mt-5 shadow-2xl flex flex-col justify-center items-center">
          <h1 className="text-md font-medium text-gray-800">Total Posts</h1>
          <h3>{posts.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mt-5">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
            >
              <DataSkeleton />
            </div>
          ))
        ) : isMyDataIsAvaible ? (
          <>
            {posts.map((post) => (
              <div
                key={post._id}
                className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
              >
                <CardData post={post} />
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
            <h1>No post have been created</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyData;
