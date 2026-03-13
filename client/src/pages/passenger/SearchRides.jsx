import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import RideCard from "../../components/shared/RideCard.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useRideStore from "../../store/useRideStore.js";

const SearchRides = () => {
  const [searchParams] = useSearchParams();
  const { rides, loading, total, searchRides } = useRideStore();
  const [form, setForm] = useState({
    sourceName: searchParams.get("source") || "",
    destinationName: searchParams.get("destination") || "",
    date: searchParams.get("date") || "",
    seats: "1",
  });

  useEffect(() => { searchRides(form); }, []);
  const handleSearch = (e) => { e.preventDefault(); searchRides(form); };

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="card mb-6 animate-fade-up">
          <p className="font-black uppercase tracking-wider text-sm mb-3">Search Rides</p>
          <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <input type="text" placeholder="From city" value={form.sourceName}
              onChange={(e) => setForm({ ...form, sourceName: e.target.value })} className="input-field" />
            <input type="text" placeholder="To city" value={form.destinationName}
              onChange={(e) => setForm({ ...form, destinationName: e.target.value })} className="input-field" />
            <input type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            <select value={form.seats}
              onChange={(e) => setForm({ ...form, seats: e.target.value })} className="input-field">
              {[1,2,3,4].map((n) => <option key={n} value={n}>{n} seat{n>1?"s":""}</option>)}
            </select>
            <button type="submit" className="btn-primary">Go</button>
          </form>
        </div>

        {loading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : rides.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <p className="text-5xl font-black mb-2" style={{ opacity: 0.08 }}>404</p>
            <p className="font-black text-lg">NO RIDES FOUND</p>
            <p className="text-sm text-gray-500 mt-1">Try changing your search filters or check back later</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 animate-fade-up">{total} ride{total !== 1 ? "s" : ""} available</p>
            <div className="space-y-4">
              {rides.map((ride, i) => (
                <div key={ride._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRides;
