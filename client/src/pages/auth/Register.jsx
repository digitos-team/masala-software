import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "../../api/auth/auth.api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, password, rePassword } = form;

    // 🔹 Validation
    if (!name || !email || !password || !rePassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔹 API call (NO ROLE)
      await registerUser({
        name,
        email,
        password,
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 p-4">
      <div className="bg-white px-10 py-12 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-black">
          M
        </div>

        <h2 className="text-slate-800 mb-2 text-3xl font-black">
          Create Account
        </h2>

        <p className="text-slate-500 mb-8 text-sm font-medium">
          Join the <span className="text-indigo-600 font-bold">Masala Pro</span>{" "}
          network
        </p>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border bg-slate-50 font-semibold"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border bg-slate-50 font-semibold"
          />

          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-2xl border bg-slate-50 font-semibold"
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            name="rePassword"
            type="password"
            placeholder="Confirm Password"
            value={form.rePassword}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border bg-slate-50 font-semibold"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase">
            Enterprise Data Protection
          </span>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-4 mt-6 rounded-2xl bg-indigo-600 text-white font-black"
        >
          {loading ? "Creating..." : "Get Started Free"}
        </button>

        <p className="mt-8 text-sm text-slate-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer font-black"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
