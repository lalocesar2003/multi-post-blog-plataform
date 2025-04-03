"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Sidebar } from "./Sidebar";
import { UseMyContext } from "@/context/Provider";
import { DialogBox } from "./DialogBox";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const Header = () => {
  const { setOpen, authToken } = UseMyContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data?.success) {
        toast.success(data?.message);
        window.location.href = "/signin";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DialogBox />
      <div className="flex justify-between items-center bg-white w-full fixed shadow-lg h-16 px-10 z-50">
        <div className="logo">
          <h1 className="text-xl font-bold">
            WEB<span className="text-emerald-600">.</span>
          </h1>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-5 font-bold text-md">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/mydata"}>My Data</Link>
            </li>
            {authToken ? (
              <>
                <li>
                  <Button
                    className={
                      "bg-black border border-black rounded-lg text-white font-bold cursor-pointer hover:bg-transparent hover:text-black transition-all duration-200"
                    }
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
                <li>
                  {" "}
                  <Button
                    className={
                      "bg-transparent border border-black rounded-lg text-black font-bold cursor-pointer hover:bg-black hover:text-white transition-all duration-200"
                    }
                    onClick={() => setOpen(true)}
                  >
                    Add Data
                  </Button>
                </li>
              </>
            ) : (
              <li>
                {" "}
                <Button
                  className={
                    "bg-black border border-black rounded-lg text-white font-bold cursor-pointer hover:bg-transparent hover:text-black transition-all duration-200"
                  }
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
              </li>
            )}
          </ul>
        </nav>

        <div className="block md:hidden">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Header;
