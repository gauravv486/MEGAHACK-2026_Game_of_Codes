import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const DriverOnboarding = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    make: "", model: "", color: "", year: "",
    registrationNumber: "", totalSeats: "4", licenseNumber: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put("/user/driver/onboarding", form);
      addToast("Onboarding submitted. Admin will verify shortly.", "success");
      setTimeout(() => navigate("/my-rides"), 2000);
    } catch (err) { addToast(err.response?.data?.message || "Submission failed.", "error"); }
    finally { setLoading(false); }
  };

  const Label = ({ children }) => <label className="block text-sm font-black uppercase tracking-wider mb-1">{children}</label>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="text-center mb-8 animate-fade-up">
          <div className="badge badge-blue inline-block mb-3">New Driver</div>
          <h1 className="text-3xl font-black">DRIVER ONBOARDING</h1>
          <p className="text-gray-500 mt-1 text-sm">Submit your vehicle details for admin verification</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 animate-fade-up-delay">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Make</Label><input name="make" value={form.make} onChange={handleChange} className="input-field" placeholder="Maruti" required /></div>
            <div><Label>Model</Label><input name="model" value={form.model} onChange={handleChange} className="input-field" placeholder="Swift Dzire" required /></div>
            <div><Label>Color</Label><input name="color" value={form.color} onChange={handleChange} className="input-field" placeholder="White" required /></div>
            <div><Label>Year</Label><input type="number" name="year" value={form.year} onChange={handleChange} className="input-field" placeholder="2020" required /></div>
            <div className="col-span-2"><Label>Registration Number</Label><input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} className="input-field" placeholder="MH12AB1234" required /></div>
            <div><Label>Total Seats</Label><select name="totalSeats" value={form.totalSeats} onChange={handleChange} className="input-field">{[2,3,4,5,6,7].map((n)=><option key={n} value={n}>{n}</option>)}</select></div>
            <div><Label>License Number</Label><input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="input-field" placeholder="MH1234567890" /></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Submitting..." : "Submit for Verification"}</button>
        </form>
      </div>
    </div>
  );
};

export default DriverOnboarding;
