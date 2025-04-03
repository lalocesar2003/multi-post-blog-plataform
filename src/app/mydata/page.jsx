import MyData from "./MyData";

export const metadata = {
  title: "Manage Your Data",
  description: "View, edit, update and delete the data your have created.",
};

const page = () => {
  return <MyData />;
};

export default page;
