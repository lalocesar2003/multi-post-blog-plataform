"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseMyContext } from "@/context/Provider";
import axios from "axios";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const SignIn = () => {
  const {
    signInData,
    setSignInData,
    loading,
    setLoading,
    showPassword,
    togglePassword,
  } = UseMyContext();

  const OnChangeHandeler = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signin", signInData);
      if (data?.success) {
        setSignInData({
          email: "",
          password: "",
        });
        toast.success(data?.message);
        window.location.href = "/";
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="bg-white rounded-lg p-3 md:p-5">
        <h1 className="text-md md:text-lg text-center font-medium mb-3">
          Sign In Now
        </h1>
        <form onSubmit={handleSignInSubmit}>
          <div className="input-items mb-5">
            <Label htmlFor="email" className={"text-md font-bold mb-2"}>
              Email
            </Label>
            <Input
              type={"email"}
              placeholder="Enter your email"
              id="email"
              name="email"
              className={"w-72 focus:ring-0 focus-visible:ring-0"}
              value={signInData.email}
              onChange={OnChangeHandeler}
            />
          </div>
          <div className="input-items mb-5">
            <Label htmlFor="password" className={"text-md font-bold mb-2"}>
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                id="password"
                name="password"
                className={"w-72 focus:ring-0 focus-visible:ring-0"}
                value={signInData.password}
                onChange={OnChangeHandeler}
              />

              <Button
                type="button"
                onClick={togglePassword}
                className={"absolute top-2 right-3 h-0 w-0"}
                variant={"ghost"}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeClosed className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
          <div className="input-items">
            <Button
              className={
                "bg-transparent border font-bold text-black border-black rounded-lg w-full hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
              }
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>

        <Link
          className="mt-3 text-blue-500 font-light text-xs flex justify-end"
          href={"/signup"}
        >
          Not a member ?
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
