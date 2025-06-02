"use client";
import React, { useEffect } from "react";
import CardData from "./CardData";
import { UseMyContext } from "@/context/Provider";
import DataSkeleton from "./DataSkeleton";

const CardList = () => {
  const { loading, getPostData, postData, authToken, getLoginUserId } =
    UseMyContext();

  useEffect(() => {
    getPostData();
    if (authToken) {
      getLoginUserId();
    }
  }, [authToken]);

  const posts = postData;
  const isPostAvailable = Array.isArray(posts) && posts.length > 0;

  return (
    <div className="grid grid-cols-12 gap-5">
      {loading ? (
        [...Array(4)].map((_, index) => (
          <div
            key={index}
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
          >
            <DataSkeleton />
          </div>
        ))
      ) : isPostAvailable ? (
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
          <h1>Ninguna publicacion hasta el momento</h1>
        </div>
      )}
    </div>
  );
};

export default CardList;
