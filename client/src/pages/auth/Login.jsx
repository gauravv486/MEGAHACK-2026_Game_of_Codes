import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import useToastStore from "../../store/useToastStore.js";

const Login = () => {
  const { login, loading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => { clearError(); setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      addToast("Logged in successfully", "success");
      if (result.role === "admin") navigate("/admin");
      else if (result.role === "driver") navigate("/my-rides");
      else navigate("/search");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "#fffef5" }}>
      <div className="w-full max-w-sm animate-fade-up">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              SEAT<span style={{ background: "#ffe156", padding: "0 4px", border: "2px solid #1a1a1a" }}>SYNC</span>
            </Link>
            <h1 className="text-3xl font-black mt-6">WELCOME BACK</h1>
            <p className="mt-1 text-gray-500 text-sm">Login to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm font-bold" style={{ background: "#ff6b6b", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-black uppercase tracking-wider">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-black uppercase tracking-wider">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="input-field" placeholder="Enter your password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-black underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
