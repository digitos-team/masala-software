import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 font-sans p-4">
      <div className="bg-white px-10 py-12 rounded-3xl shadow-xl w-full max-w-md text-center border border-white">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
          M
        </div>

        <h2 className="text-slate-800 mb-2 text-3xl font-bold">Welcome Back</h2>

        <p className="text-slate-500 mb-8 text-sm">
          Enter your credentials to access your account
        </p>

        {/* Email */}
        <div className="text-left mb-4">
          <label className="block text-sm font-semibold text-slate-600 mb-2 ml-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl border bg-slate-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="text-left mb-4">
          <label className="block text-sm font-semibold text-slate-600 mb-2 ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border bg-slate-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-8 text-sm text-slate-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 cursor-pointer font-bold hover:underline"
          >
            sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
