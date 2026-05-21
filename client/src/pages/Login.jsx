import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import API from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [error] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-87.5 text-center bg-white-600 border border-green-500/40 rounded-2xl px-8 shadow-lg">
        <h1 className="text-black text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Please {state === "login" ? "sign in" : "create an account"} to
          continue
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full  ring-2 ring-black/10 focus-within:ring-green-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full bg-transparent text-black placeholder:text-gray-400 border-none outline-none "
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4  ring-2 ring-black/10 focus-within:ring-green-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-black placeholder:text-gray-400 border-none outline-none "
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className=" flex items-center mt-4 w-full  ring-2 ring-black/10 focus-within:ring-green-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-black placeholder:text-gray-400 border-none outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-black hover:underline">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:bg-green-600 transition ">
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-green-600 hover:underline ml-1">
            click here
          </span>
        </p>
      </form>
      {/* Soft Backdrop*/}
      <div className="fixed inset-0 -z-1 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-green-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-green-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default Login;
