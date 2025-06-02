import React from "react";
import CardList from "./CardList";

const Home = () => {
  return (
    <div className="pt-24 px-5 lg:px-10">
      <div className="bg-white w-full md:w-1/2 rounded-lg border-r-8 border-amber-700 px-3 py-5 mb-5">
        <h1 className="text-md lg:text-lg font-medium">
          Encuentra las mejores ofertas
        </h1>
      </div>
      <CardList />
    </div>
  );
};

export default Home;
