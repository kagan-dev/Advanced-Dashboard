// Layout.js or PageWrapper.js
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <div>
      <ToastContainer autoClose={4000} />{children}
    </div>
  );
};

export default Layout;
