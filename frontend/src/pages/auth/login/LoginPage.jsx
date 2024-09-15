import { useState } from "react";
import { Link } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import { User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const storedIdentity = localStorage.getItem("identity");
  const [formData, setFormData] = useState({
    // username: "",
    userName: "",
    password: "",
    // identity: storedIdentity || "",
  });

  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    isError,
    error,
  } = useMutation({
    // mutationFn: async ({ username, password, identity }) => {
    mutationFn: async ({ userName, password }) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/Auth/login`,
          // `${import.meta.env.VITE_SERVER_URI}/api/Auth/weblogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({ username, password, identity }),
            body: JSON.stringify({ userName, password }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Login failed");
        }

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
    onSuccess: (response) => {
      // const token = response?.data?.token;
      const token = response?.token;
      if (token) {
        localStorage.setItem("jwtToken", token);
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Unexpected response format");
      }
    },
    onError: (error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <img src="/anahtar1.png" className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <img src="/app_icon.png" className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Login</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <User />
            <input
              type="text"
              className="grow"
              placeholder="username"
              // name="username"
              name="userName"
              onChange={handleInputChange}
              // value={formData.username}
              value={formData.userName}
            />
          </label>

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
            Login
          </button>
          {isError && (
            <p className="text-red-500">
              {error.message || "Something went wrong"}
            </p>
          )}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
