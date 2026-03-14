import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import LiveTrackingDemo from "../components/shared/LiveTrackingDemo.jsx";
import { CarIllustration, SearchIllustration, BookIllustration, TravelIllustration, HeroScene, PersonGirl, PersonGuy, PersonWaving } from "../components/shared/FlatIllustrations.jsx";
import useAuthStore from "../store/useAuthStore.js";

/* ─── Inline Subscription Pay Modal ──────────── */
const SubPayModal = ({ plan, onClose }) => {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const fmt = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  const pay = async () => { setProcessing(true); await new Promise((r) => setTimeout(r, 2200)); setDone(true); };

  if (done) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-sm animate-fade-up" style={{ background: "#b8f3b0", border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a", padding: "40px 30px" }}>
          <div className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center"
              style={{ background: "#fff", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}>
              <span style={{ fontSize: "32px", color: "#2e7d32", fontWeight: 900 }}>OK</span>
            </div>
            <h2 className="text-2xl font-black mb-1">PAYMENT DONE!</h2>
            <p className="text-sm font-bold text-gray-600 mb-3">Subscription activated</p>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Plan</span>
                <span className="font-black">{plan.name}</span>
              </div>
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Amount</span>
                <span className="font-black">INR {plan.price}/mo</span>
              </div>
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Status</span>
                <span className="font-black" style={{ color: "#2e7d32" }}>ACTIVE</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full" style={{ background: "#1a1a1a", color: "#b8f3b0" }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm animate-fade-up" style={{ background: "#fffef5", border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}>
        <div className="p-5" style={{ background: "#635BFF", borderBottom: "3px solid #1a1a1a" }}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center font-black text-white text-xs" style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>S</div>
              <span className="text-white font-black text-xs uppercase tracking-wider">Stripe Demo</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white font-black text-lg cursor-pointer">X</button>
          </div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Subscribe to {plan.name}</p>
          <p className="text-white text-3xl font-black">INR {plan.price}<span className="text-sm font-bold">/month</span></p>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} value={card.number}
              onChange={(e) => setCard({ ...card, number: fmt(e.target.value) })} className="input-field !text-base tracking-wider" />
            <p className="text-xs text-gray-400 mt-0.5">Demo: any card number works</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">Expiry</label>
              <input type="text" placeholder="MM/YY" maxLength={5} value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: fmtExp(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">CVC</label>
              <input type="password" placeholder="***" maxLength={4} value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1">Name on Card</label>
            <input type="text" placeholder="Full name" value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })} className="input-field" />
          </div>
          <button onClick={pay} disabled={processing} className="w-full py-3 font-black uppercase tracking-wider text-sm cursor-pointer transition-all"
            style={{ background: processing ? "#4b45c7" : "#635BFF", color: "#fff", border: "3px solid #1a1a1a",
              boxShadow: processing ? "0 0 0 #1a1a1a" : "4px 4px 0 #1a1a1a", transform: processing ? "translate(2px,2px)" : "none" }}>
            {processing ? (<span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-bounce-brutal">.</span>
              <span className="inline-block animate-bounce-brutal" style={{ animationDelay: "0.1s" }}>.</span>
              <span className="inline-block animate-bounce-brutal" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="ml-2">Processing...</span>
            </span>) : `Subscribe INR ${plan.price}/mo`}
          </button>
          <p className="text-center text-xs text-gray-400">Powered by <strong>Stripe</strong> — Demo Mode</p>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ source: "", destination: "", date: "" });
  const [subModal, setSubModal] = useState(null);

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

            <div className="animate-fade-up-delay flex items-center justify-center">
              <HeroScene width={420} />
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
              { n: "01", title: "SEARCH", desc: "Enter where you're going and when. We'll find all available rides on that route.", color: "card-blue", icon: <SearchIllustration size={56} /> },
              { n: "02", title: "BOOK", desc: "Pick a ride, check the driver's rating, and request your seats. Pay with cash or digital.", color: "card-green", icon: <BookIllustration size={56} /> },
              { n: "03", title: "TRAVEL", desc: "Meet your driver at the pickup point. Track the ride live and reach your destination.", color: "card-pink", icon: <TravelIllustration size={56} /> },
            ].map((step, i) => (
              <div key={step.n} className={`${step.color} p-6 animate-fade-up`}
                style={{ animationDelay: `${i * 0.12}s`, border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
                <div className="mb-3">{step.icon}</div>
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

      {/* ═══ SUBSCRIPTION PLANS ═══ */}
      <section className="py-16 px-6" style={{ background: "#635BFF", borderTop: "3px solid #1a1a1a", borderBottom: "3px solid #1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest mb-3"
              style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
              Powered by Stripe
            </div>
            <h2 className="text-4xl font-black text-white mb-2">CHOOSE YOUR PLAN</h2>
            <p className="text-white/80 max-w-md mx-auto">Unlock premium features and save even more. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Free",
                price: 0,
                bg: "#ffffff",
                features: ["5 rides / month", "Basic matching", "Cash payment", "Standard support"],
                cta: "Current Plan",
                disabled: true,
              },
              {
                name: "Pro",
                price: 299,
                bg: "#ffe156",
                popular: true,
                features: ["Unlimited rides", "Smart AI matching", "Priority booking", "2x token rewards", "24/7 support"],
                cta: "Subscribe Now",
                disabled: false,
              },
              {
                name: "Business",
                price: 999,
                bg: "#b8f3b0",
                features: ["Everything in Pro", "Team dashboard", "Corporate billing", "Dedicated manager", "Custom routes", "API access"],
                cta: "Subscribe Now",
                disabled: false,
              },
            ].map((plan, i) => (
              <div key={plan.name} className="animate-fade-up relative"
                style={{ animationDelay: `${i * 0.1}s` }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 text-xs font-black uppercase tracking-widest"
                    style={{ background: "#ff8fab", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                    Most Popular
                  </div>
                )}
                <div className="p-6 h-full flex flex-col"
                  style={{
                    background: plan.bg,
                    border: "3px solid #1a1a1a",
                    boxShadow: plan.popular ? "8px 8px 0 #1a1a1a" : "6px 6px 0 #1a1a1a",
                    transform: plan.popular ? "scale(1.03)" : "none",
                  }}>
                  <h3 className="text-xl font-black uppercase mb-1">{plan.name}</h3>
                  <div className="mb-5">
                    <span className="text-4xl font-black">{plan.price === 0 ? "Free" : `INR ${plan.price}`}</span>
                    {plan.price > 0 && <span className="text-sm font-bold text-gray-600">/month</span>}
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="font-black text-green-700 mt-0.5">+</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => !plan.disabled && setSubModal(plan)}
                    disabled={plan.disabled}
                    className="w-full py-3 font-black uppercase tracking-wider text-sm cursor-pointer transition-all"
                    style={{
                      background: plan.disabled ? "#e5e5e5" : "#1a1a1a",
                      color: plan.disabled ? "#999" : "#ffe156",
                      border: "3px solid #1a1a1a",
                      boxShadow: plan.disabled ? "0 0 0 transparent" : "4px 4px 0 rgba(0,0,0,0.3)",
                      cursor: plan.disabled ? "default" : "pointer",
                    }}>
                    {plan.cta}
                  </button>
                </div>
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
              { name: "Priya Sharma", city: "Mumbai", text: "I save over 3000 rupees a month commuting to Pune. The drivers are verified and the app is super simple.", stars: 5, color: "#ff8fab" },
              { name: "Rahul Verma", city: "Delhi", text: "As a driver, I cover my fuel costs completely. Met some great people on the way. Win-win situation honestly.", stars: 5, color: "#ffe156" },
              { name: "Ananya Patel", city: "Bangalore", text: "The live tracking feature gives my parents peace of mind. I travel solo and always feel safe with SeatSync.", stars: 4, color: "#b8f3b0" },
            ].map((t, i) => (
              <div key={t.name} className="card p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: 40, height: 40, background: t.color, border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="font-black text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-black text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t.city}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex gap-1">
                  {Array(t.stars).fill(null).map((_,j) => <span key={j} className="font-black" style={{ color: "#ffe156", WebkitTextStroke: "1px #1a1a1a", fontSize: 18 }}>*</span>)}
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-center gap-6 flex-wrap">
            <div className="hidden md:block animate-fade-up" style={{ marginBottom: -3 }}>
              <PersonGirl size={100} />
            </div>
            <div className="card-yellow p-10 text-center animate-fade-up flex-1 max-w-lg" style={{ border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}>
              <h2 className="text-4xl font-black mb-3">READY?</h2>
              <p className="text-lg mb-8 max-w-md mx-auto">
                Join thousands of smart travelers who save money and reduce emissions every single day.
              </p>
              <button onClick={() => navigate("/register")} className="btn-primary" style={{ background: "#1a1a1a", color: "#ffe156" }}>
                Get Started Free
              </button>
            </div>
            <div className="hidden md:block animate-fade-up-delay" style={{ marginBottom: -3 }}>
              <PersonWaving size={100} />
            </div>
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

      {/* Subscription Payment Modal */}
      {subModal && <SubPayModal plan={subModal} onClose={() => setSubModal(null)} />}
    </div>
  );
};

export default LandingPage;
