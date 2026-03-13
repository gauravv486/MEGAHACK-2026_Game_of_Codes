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
        minPrice: "",
        maxPrice: "",
    });

    useEffect(() => {
        searchRides({
            sourceName: form.sourceName,
            destinationName: form.destinationName,
            date: form.date,
            seats: form.seats,
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        searchRides(form);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="card mb-6">
                    <form onSubmit={handleSearch}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <input type="text" placeholder="From city"
                            value={form.sourceName}
                            onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                            className="input-field col-span-2 md:col-span-1" />
                        <input type="text" placeholder="To city"
                            value={form.destinationName}
                            onChange={(e) => setForm({ ...form, destinationName: e.target.value })}
                            className="input-field col-span-2 md:col-span-1" />
                        <input type="date" value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="input-field" />
                        <select value={form.seats}
                            onChange={(e) => setForm({ ...form, seats: e.target.value })}
                            className="input-field">
                            {[1, 2, 3, 4].map((n) => (
                                <option key={n} value={n}>{n} seat{n > 1 ? "s" : ""}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn-primary col-span-2 md:col-span-1">
                            Search
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="py-20"><Spinner size="lg" /></div>
                ) : rides.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-medium">No rides found</p>
                        <p className="text-sm mt-1">Try changing your search filters</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-500 mb-4">{total} ride{total !== 1 ? "s" : ""} found</p>
                        <div className="space-y-4">
                            {rides.map((ride) => (
                                <RideCard key={ride._id} ride={ride} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchRides;
