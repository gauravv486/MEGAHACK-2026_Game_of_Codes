import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import LiveTrackingDemo from "../components/shared/LiveTrackingDemo.jsx";
import useAuthStore from "../store/useAuthStore.js";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ source: "", destination: "", date: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    navigate(`/search?${params}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />

      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="marquee-track py-2">
        <div className="flex gap-12 items-center text-sm font-black uppercase tracking-widest px-6">
          {Array(2).fill(null).map((_, j) => (
            <div key={j} className="flex gap-12 items-center">
              <span>Intercity Carpooling</span><span className="text-lg">/</span>
              <span>12,000+ Rides</span><span className="text-lg">/</span>
              <span>80+ Cities</span><span className="text-lg">/</span>
              <span>Save Money</span><span className="text-lg">/</span>
              <span>Reduce CO2</span><span className="text-lg">/</span>
              <span>Travel Safe</span><span className="text-lg">/</span>
              <span>Smart Matching</span><span className="text-lg">/</span>
              <span>Verified Drivers</span><span className="text-lg">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-up">
              <div className="badge badge-yellow inline-block mb-4">Now Live</div>
              <h1 className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-6">
                SHARE<br />THE RIDE.<br />
                <span style={{ background: "#ffe156", padding: "0 8px", border: "3px solid #1a1a1a", display: "inline-block", transform: "rotate(-1deg)" }}>
                  SPLIT THE COST.
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
                India's boldest intercity carpooling platform. Connect with drivers heading your way.
                It's cheaper than a bus, greener than driving alone, and way more fun.
              </p>
              <div className="flex gap-3 flex-wrap">
                {user ? (
                  <button onClick={() => navigate("/search")} className="btn-primary">Find a Ride</button>
                ) : (
                  <>
                    <button onClick={() => navigate("/register")} className="btn-primary">Get Started</button>
                    <button onClick={() => navigate("/login")} className="btn-outline">Login</button>
                  </>
                )}
              </div>
            </div>

            <div className="animate-fade-up-delay">
              <div className="card-yellow p-8" style={{ transform: "rotate(2deg)" }}>
                <p className="text-5xl font-black mb-2">45+</p>
                <p className="font-bold uppercase tracking-wider text-sm">Tons of CO2 saved</p>
                <div className="mt-4 border-t-3 border-black pt-4" style={{ borderTop: "3px solid #1a1a1a" }}>
                  <p className="text-sm font-medium">That's like planting 2,250 trees. Every shared ride counts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH (logged in only) ═══ */}
      {user && (
        <section className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="card animate-fade-up">
              <p className="font-black uppercase tracking-wider text-sm mb-3">Quick Search</p>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input type="text" placeholder="From city" value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-field" />
                <input type="text" placeholder="To city" value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })} className="input-field" />
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
                <button type="submit" className="btn-primary">Search</button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ═══ STATS ═══ */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "RIDES SHARED", value: "12,000+", bg: "card-yellow" },
            { label: "CITIES", value: "80+", bg: "card-blue" },
            { label: "CO2 SAVED", value: "45 TONS", bg: "card-green" },
            { label: "USERS", value: "8,500+", bg: "card-pink" },
          ].map((s, i) => (
            <div key={s.label} className={`${s.bg} p-5 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s`, border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 px-6" style={{ background: "#ffe156", borderTop: "3px solid #1a1a1a", borderBottom: "3px solid #1a1a1a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-10 animate-fade-up">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "SEARCH", desc: "Enter where you're going and when. We'll find all available rides on that route.", color: "card-blue" },
              { n: "02", title: "BOOK", desc: "Pick a ride, check the driver's rating, and request your seats. Pay with cash or digital.", color: "card-green" },
              { n: "03", title: "TRAVEL", desc: "Meet your driver at the pickup point. Track the ride live and reach your destination.", color: "card-pink" },
            ].map((step, i) => (
              <div key={step.n} className={`${step.color} p-6 animate-fade-up`}
                style={{ animationDelay: `${i * 0.12}s`, border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
                <p className="text-6xl font-black mb-2" style={{ opacity: 0.15 }}>{step.n}</p>
                <h3 className="text-xl font-black mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVE TRACKING ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-up">
            <div className="badge badge-green inline-block mb-3">Real-Time</div>
            <h2 className="text-4xl font-black">LIVE RIDE TRACKING</h2>
            <p className="text-gray-600 max-w-lg mt-2">
              Track every ride in real-time. Share your live location with friends and family. Safety first, always.
            </p>
          </div>
          <div className="animate-fade-up-delay">
            <LiveTrackingDemo />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-10 animate-fade-up">WHY SEATSYNC?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "TRUST SYSTEM", desc: "Every user gets a trust score. Ratings, verifications, and ride history all contribute. No surprises.", bg: "card-yellow" },
              { title: "DYNAMIC PRICING", desc: "Our AI suggests fair prices based on demand, distance, time of day, and route popularity.", bg: "card-blue" },
              { title: "CARBON TRACKER", desc: "See exactly how much CO2 you save per ride. Earn badges. Flex your green credentials.", bg: "card-green" },
              { title: "SMART MATCHING", desc: "GPS-based route matching works even when city names differ. We find rides you'd never find manually.", bg: "card-pink" },
              { title: "INSTANT UPDATES", desc: "Real-time notifications for bookings, cancellations, and ride status changes. Never miss a beat.", bg: "card-orange" },
              { title: "VERIFIED DRIVERS", desc: "Every driver goes through admin verification. License, vehicle docs, and identity — all checked.", bg: "card-lilac" },
            ].map((f, i) => (
              <div key={f.title} className={`${f.bg} p-6 animate-fade-up`}
                style={{ animationDelay: `${i * 0.08}s`, border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
                <h3 className="font-black text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-16 px-6" style={{ background: "#a0d2ff", borderTop: "3px solid #1a1a1a", borderBottom: "3px solid #1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-10 animate-fade-up">WHAT RIDERS SAY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Priya Sharma", city: "Mumbai", text: "I save over 3000 rupees a month commuting to Pune. The drivers are verified and the app is super simple.", stars: 5 },
              { name: "Rahul Verma", city: "Delhi", text: "As a driver, I cover my fuel costs completely. Met some great people on the way. Win-win situation honestly.", stars: 5 },
              { name: "Ananya Patel", city: "Bangalore", text: "The live tracking feature gives my parents peace of mind. I travel solo and always feel safe with SeatSync.", stars: 4 },
            ].map((t, i) => (
              <div key={t.name} className="card p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="border-t-2 border-black pt-3 flex items-center justify-between">
                  <div>
                    <p className="font-black text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t.city}</p>
                  </div>
                  <div className="flex gap-0.5 text-sm">
                    {Array(t.stars).fill(null).map((_,j) => <span key={j} className="font-black">*</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-10 animate-fade-up">FAQ</h2>
          {[
            { q: "How does pricing work?", a: "Drivers set their price per seat. Our AI suggests fair rates based on distance, demand, and time. You always see the price before booking." },
            { q: "Is it safe to travel with strangers?", a: "Every driver is verified by our admin team. We check licenses, vehicle documents, and identity. Plus, live tracking lets your contacts follow your trip." },
            { q: "What if the driver cancels?", a: "You get an instant notification. Your booking is automatically refunded and we help you find alternative rides on the same route." },
            { q: "Can I ride with my bike or luggage?", a: "It depends on the driver's vehicle and preferences. You can see vehicle details and contact the driver before booking." },
            { q: "How do I become a driver?", a: "Sign up, choose 'Offer a Ride', submit your vehicle and license details. Our admin team verifies you within 24 hours." },
          ].map((faq, i) => (
            <div key={i} className="card mb-3 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <p className="font-black">{faq.q}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="card-yellow p-10 text-center animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}>
            <h2 className="text-4xl font-black mb-3">READY?</h2>
            <p className="text-lg mb-8 max-w-md mx-auto">
              Join thousands of smart travelers who save money and reduce emissions every single day.
            </p>
            <button onClick={() => navigate("/register")} className="btn-primary" style={{ background: "#1a1a1a", color: "#ffe156" }}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "3px solid #1a1a1a", background: "#1a1a1a", color: "#fffef5" }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <p className="text-2xl font-black mb-3">
                SEAT<span style={{ background: "#ffe156", color: "#1a1a1a", padding: "0 4px" }}>SYNC</span>
              </p>
              <p className="text-sm opacity-70 max-w-sm leading-relaxed">
                India's boldest intercity carpooling platform. Connecting drivers with empty seats
                to passengers heading the same way. Cheaper. Greener. Better.
              </p>
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest mb-4">Platform</p>
              <div className="space-y-2 text-sm opacity-70">
                <a href="/search" className="block hover:opacity-100 transition-opacity">Find Rides</a>
                <a href="/register" className="block hover:opacity-100 transition-opacity">Become a Driver</a>
                <a href="/login" className="block hover:opacity-100 transition-opacity">Login</a>
              </div>
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest mb-4">Legal</p>
              <div className="space-y-2 text-sm opacity-70">
                <a href="#" className="block hover:opacity-100 transition-opacity">Privacy Policy</a>
                <a href="#" className="block hover:opacity-100 transition-opacity">Terms of Service</a>
                <a href="#" className="block hover:opacity-100 transition-opacity">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs opacity-50"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span>2026 SeatSync. All rights reserved.</span>
            <span>Made in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
