import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const MyContext = createContext();

export const Provider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [authToken, setAuthToken] = useState("");

  const getAuthToken = async () => {
    try {
      const { data } = await axios.get("/api/auth/token", {
        withCredentials: true,
      });

      if (data.success) {
        setAuthToken(data?.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [userPostData, setUserPostData] = useState({
    title: "",
    description: "",
    status: "",
  });

  const [postData, setPostData] = useState([]);

  const getPostData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/getdata");

      const filterPostData = data?.post.filter(
        (post) => post.status === "publish"
      );
      if (data?.success) {
        setPostData(filterPostData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [loginUserId, setLoginUserId] = useState("");

  const getLoginUserId = async () => {
    try {
      const { data } = await axios.get("/api/auth/userloginid", {
        withCredentials: true,
      });
      if (data?.success) {
        setLoginUserId(data?.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [postDataUpdateId, setPostDataUpDateId] = useState("");

  const [showCommentInput, setShowCommentInput] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    getAuthToken();
  }, [authToken]);

  return (
    <MyContext.Provider
      value={{
        open,
        setOpen,
        loading,
        setLoading,
        signUpData,
        setSignUpData,
        signInData,
        setSignInData,
        authToken,
        userPostData,
        setUserPostData,
        getPostData,
        postData,
        getLoginUserId,
        loginUserId,
        postDataUpdateId,
        setPostDataUpDateId,
        setPostData,
        showCommentInput,
        setShowCommentInput,
        showPassword,
        togglePassword,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const UseMyContext = () => {
  return useContext(MyContext);
};
