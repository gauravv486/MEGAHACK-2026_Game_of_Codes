import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import api from "../../api/axios.js";

const DriverOnboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    make: "", model: "", color: "", year: "",
    registrationNumber: "", totalSeats: "4", licenseNumber: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/user/driver/onboarding", form);
      setMsg("Submitted. Admin will verify your profile shortly.");
      setTimeout(() => navigate("/my-rides"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Driver Onboarding</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Submit your vehicle details for verification before posting rides
          </p>
        </div>

        {msg && (
          <div className={`rounded-lg px-4 py-3 mb-4 text-sm border ${
            msg.includes("Submitted")
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make</label>
              <input name="make" value={form.make} onChange={handleChange}
                className="input-field" placeholder="Maruti" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
              <input name="model" value={form.model} onChange={handleChange}
                className="input-field" placeholder="Swift Dzire" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input name="color" value={form.color} onChange={handleChange}
                className="input-field" placeholder="White" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" name="year" value={form.year} onChange={handleChange}
                className="input-field" placeholder="2020" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input name="registrationNumber" value={form.registrationNumber}
                onChange={handleChange} className="input-field"
                placeholder="MH12AB1234" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
              <select name="totalSeats" value={form.totalSeats}
                onChange={handleChange} className="input-field">
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input name="licenseNumber" value={form.licenseNumber}
                onChange={handleChange} className="input-field" placeholder="MH1234567890" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverOnboarding;
