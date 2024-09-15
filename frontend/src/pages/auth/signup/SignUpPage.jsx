"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
import KeySvg from "../../../components/svgs/key.jsx";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    mail: "",
    // username: "",
    userName: "",
    fullName: "",
    // tel: "",
    telephone: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate, isError, error } = useMutation({
    mutationFn: async ({ mail, userName, fullName, telephone, password }) => {
      // mutationFn: async ({ email, username, fullName, tel, password }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mail,
              userName,
              fullName,
              telephone,
              password,
            }),
            // body: JSON.stringify({ email, username, fullName, tel, password }),
          }
        );

        // Response JSON Check
        const contentType = res.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to create account");
        } else {
          data = await res.text();
          if (!res.ok) throw new Error(data || "Failed to create account");
        }

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <div className="max-w-screen-xl mx-auto flex h-screen px-10">
        <div className="flex-1 hidden lg:flex items-center justify-center mt-2">
          <img src="/anahtar1.png" className="lg:w-2/3 fill-white" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <form
            className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
            onSubmit={handleSubmit}
          >
            <img src="/app_icon.png" className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white">Sign up</h1>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdOutlineMail />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="mail"
                onChange={handleInputChange}
                value={formData.mail}
              />
            </label>
            <div className="flex gap-4 flex-wrap">
              <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                <FaUser />
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  // name="username"
                  name="userName"
                  onChange={handleInputChange}
                  value={formData.username}
                />
              </label>
              <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                <MdDriveFileRenameOutline />
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                />
              </label>
              <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                <CiPhone />
                <input
                  type="text"
                  className="grow"
                  placeholder="Phone Number"
                  // name="tel"
                  name="telephone"
                  onChange={handleInputChange}
                  value={formData.tel}
                />
              </label>
            </div>
            <label className="input input-bordered rounded flex items-center gap-2">
              <MdPassword />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>
            <button className="btn rounded-full btn-primary text-white">
              Sign up
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
          <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
            <p className="text-white text-lg">Already have an account?</p>
            <Link to="/login">
              <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
