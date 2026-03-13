import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import useToastStore from "../../store/useToastStore.js";

const Register = () => {
  const { register, loading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "passenger" });

  const handleChange = (e) => { clearError(); setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      addToast("Account created successfully", "success");
      if (form.role === "driver") navigate("/onboarding");
      else navigate("/search");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "#fffef5" }}>
      <div className="w-full max-w-sm animate-fade-up">
        <div className="card p-8">
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              SEAT<span style={{ background: "#ffe156", padding: "0 4px", border: "2px solid #1a1a1a" }}>SYNC</span>
            </Link>
            <h1 className="text-3xl font-black mt-6">CREATE ACCOUNT</h1>
            <p className="text-gray-500 mt-1 text-sm">Join the ride-sharing revolution</p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm font-bold" style={{ background: "#ff6b6b", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-1">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="9876543210" required />
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Min 6 characters" required />
            </div>
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-2">
                {["passenger", "driver"].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className="p-3 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer"
                    style={{
                      background: form.role === r ? "#ffe156" : "#fff",
                      border: "2px solid #1a1a1a",
                      boxShadow: form.role === r ? "4px 4px 0 #1a1a1a" : "2px 2px 0 #1a1a1a",
                      transform: form.role === r ? "translate(-1px, -1px)" : "none",
                    }}>
                    {r === "passenger" ? "Find Rides" : "Offer Rides"}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <Link to="/login" className="font-black underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
