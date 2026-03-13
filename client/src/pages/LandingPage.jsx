import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";

const LandingPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ source: "", destination: "", date: "" });

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(form).toString();
        navigate(`/search?${params}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Share the ride. Split the cost.
                    </h1>
                    <p className="text-primary-100 text-lg mb-10">
                        Intercity carpooling that connects drivers with empty seats to
                        passengers traveling the same way.
                    </p>

                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <form onSubmit={handleSearch}
                            className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input
                                type="text"
                                placeholder="From city"
                                value={form.source}
                                onChange={(e) => setForm({ ...form, source: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="text"
                                placeholder="To city"
                                value={form.destination}
                                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="input-field"
                            />
                            <button type="submit" className="btn-primary">
                                Search Rides
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { label: "Rides Shared", value: "12,000+" },
                        { label: "Cities Connected", value: "80+" },
                        { label: "CO2 Saved (kg)", value: "45,000+" },
                        { label: "Active Users", value: "8,500+" },
                    ].map((stat) => (
                        <div key={stat.label} className="card">
                            <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-4 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
                    How it works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: "1", title: "Search a Ride", desc: "Enter your source, destination and travel date to find available rides." },
                        { step: "2", title: "Book a Seat", desc: "Choose a ride, review driver profile and book your seat instantly." },
                        { step: "3", title: "Travel Together", desc: "Meet your driver at the pickup point and enjoy the journey." },
                    ].map((item) => (
                        <div key={item.step} className="card text-center">
                            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary-600 py-14 text-center text-white px-4">
                <h2 className="text-3xl font-bold mb-3">Ready to travel smarter?</h2>
                <p className="text-primary-100 mb-6">
                    Join thousands of travelers already saving money and reducing emissions.
                </p>
                <button onClick={() => navigate("/register")} className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                    Get Started
                </button>
            </section>
        </div>
    );
};

export default LandingPage;
