import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { validateEmail } from "../../utils/validateEmail";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const Navigate = useNavigate();

  const [error, setError] = useState("");

  // ...

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Email and Password are required.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      const token = response.data.token;

      // Handle successful login
      if (token) {
        // Store token in local storage
        console.log(token);
        localStorage.setItem("token", token);
        Navigate("/home");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log(error.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <form className="w-64">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={handleShowPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            onClick={(e) => handleLogin(e)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          {"Don't"} have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
