"use client";
import { UseMyContext } from "@/context/Provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DialogBox() {
  const {
    open,
    setOpen,
    userPostData,
    setUserPostData,
    loading,
    setLoading,
    getPostData,
    setPostDataUpDateId,
    postDataUpdateId,
    setPostData,
  } = UseMyContext();

  const onChangeHandeler = (e) => {
    const { name, value } = e.target;
    setUserPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (postDataUpdateId) {
        const { data } = await axios.put(
          `/api/post/update/${postDataUpdateId}`,
          userPostData,
          {
            withCredentials: true,
          }
        );

        if (data?.success) {
          toast.success(data?.message);
          setUserPostData({
            title: "",
            description: "",
            status: "",
          });
          setPostData(data);
          setOpen(false);
          getPostData();
          setPostDataUpDateId("");
        } else {
          toast.error(data?.message);
        }
      } else {
        const { data } = await axios.post("/api/post/create", userPostData, {
          withCredentials: true,
        });

        if (data?.success) {
          toast.success(data?.message || "Post created successfully");
          setOpen(false);
          setUserPostData({
            title: "",
            description: "",
            status: "",
          });
          getPostData();
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Post creation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setUserPostData({
            title: "",
            description: "",
            status: "",
          });
          setPostDataUpDateId("");
          setOpen(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Thoughts</DialogTitle>
          <DialogDescription>
            Express what's on your mind & inpire the world!
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={handlePostSubmit}>
          <Input
            type={"text"}
            placeholder="Enter your post title here..."
            className={"focus:ring-0 focus-visible:ring-0"}
            name="title"
            value={userPostData.title}
            onChange={onChangeHandeler}
          />
          <Textarea
            type={"text"}
            placeholder="Enter your post description here..."
            className={"focus:ring-0 focus-visible:ring-0"}
            name="description"
            value={userPostData.description}
            onChange={onChangeHandeler}
          />

          <Select
            value={userPostData.status}
            onValueChange={(value) =>
              setUserPostData((prev) => ({
                ...prev,
                status: value,
              }))
            }
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Status"></SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="publish">Publish</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            className={
              "bg-black w-full border text-white cursor-pointer font-bold hover:bg-transparent hover:text-black"
            }
            type="submit"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : postDataUpdateId ? (
              "Update"
            ) : (
              "Add Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
