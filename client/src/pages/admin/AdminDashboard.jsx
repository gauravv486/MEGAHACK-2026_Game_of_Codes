import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import api from "../../api/axios.js";

/* ─── tiny helpers ──────────────────────────────────────── */

const StatCard = ({ label, value, color = "text-primary-600" }) => (
  <div className="card text-center">
    <p className={`text-3xl font-bold ${color}`}>{value ?? "—"}</p>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
  </div>
);

const Badge = ({ text, variant = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colors[variant] || colors.gray}`}>
      {text}
    </span>
  );
};

const statusBadgeVariant = (s) =>
  ({ scheduled: "blue", ongoing: "yellow", completed: "green", cancelled: "red" })[s] || "gray";

const verificationBadgeVariant = (s) =>
  ({ pending: "orange", verified: "green", rejected: "red" })[s] || "gray";

/* ─── TABS ──────────────────────────────────────────────── */

const TABS = ["overview", "rides", "users", "drivers", "routes", "fraud"];

/* ─── main component ────────────────────────────────────── */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [suspicious, setSuspicious] = useState({ lowTrustUsers: [], highCancellationUsers: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // ride filters
  const [rideStatus, setRideStatus] = useState("");
  const [ridePage, setRidePage] = useState(1);
  const [rideMeta, setRideMeta] = useState({ total: 0, pages: 1 });

  // trust score modal
  const [trustModal, setTrustModal] = useState(null); // { id, name, current }
  const [trustInput, setTrustInput] = useState({ score: "", reason: "" });

  // driver verify modal
  const [verifyModal, setVerifyModal] = useState(null); // { id, name }
  const [verifyInput, setVerifyInput] = useState({ status: "verified", note: "" });

  /* ── data fetching ─────────────────── */

  const fetchDashboard = async () => {
    try {
      const [statsRes, usersRes, routesRes, fraudRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users?limit=50"),
        api.get("/admin/analytics/popular-routes"),
        api.get("/admin/fraud/suspicious-users"),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setRoutes(routesRes.data.routes);
      setSuspicious(fraudRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async (status = rideStatus, page = 1) => {
    try {
      const params = { page, limit: 15 };
      if (status) params.status = status;
      const res = await api.get("/admin/rides", { params });
      setRides(res.data.rides);
      setRideMeta({ total: res.data.total, pages: res.data.pages });
      setRidePage(res.data.page);
    } catch (err) {
      console.error("Rides fetch error:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/admin/users?role=driver&limit=50");
      setDrivers(res.data.users);
    } catch (err) {
      console.error("Drivers fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRides();
    fetchDrivers();
  }, []);

  /* ── actions ───────────────────────── */

  const toggleUser = async (id, isActive) => {
    const url = isActive ? `/admin/users/${id}/deactivate` : `/admin/users/${id}/activate`;
    await api.put(url);
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)));
    setDrivers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)));
  };

  const submitTrustScore = async () => {
    if (!trustModal) return;
    try {
      await api.put(`/admin/users/${trustModal.id}/trust-score`, {
        score: Number(trustInput.score),
        reason: trustInput.reason,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === trustModal.id ? { ...u, trustScore: Number(trustInput.score) } : u))
      );
      setTrustModal(null);
      setTrustInput({ score: "", reason: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update trust score");
    }
  };

  const submitVerifyDriver = async () => {
    if (!verifyModal) return;
    try {
      await api.put(`/admin/drivers/${verifyModal.id}/verify`, verifyInput);
      // refresh drivers list
      await fetchDrivers();
      setVerifyModal(null);
      setVerifyInput({ status: "verified", note: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  /* ── loading state ─────────────────── */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  /* ── render ─────────────────────────── */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                if (t === "rides") fetchRides();
                if (t === "drivers") fetchDrivers();
              }}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                tab === t
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {tab === "overview" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Drivers" value={stats.totalDrivers} />
            <StatCard label="Total Rides" value={stats.totalRides} />
            <StatCard label="Active Rides" value={stats.activeRides} color="text-green-600" />
            <StatCard label="Total Bookings" value={stats.totalBookings} />
            <StatCard label="Pending Bookings" value={stats.pendingBookings} color="text-yellow-600" />
            <StatCard label="Completed" value={stats.completedBookings} color="text-green-600" />
            <StatCard label="Cancelled" value={stats.cancelledBookings} color="text-red-500" />
            <StatCard label="New Users (7d)" value={stats.newUsersThisWeek} color="text-purple-600" />
            <StatCard label="Revenue (Rs.)" value={stats.totalRevenue} />
            <StatCard label="CO₂ Saved (kg)" value={stats.totalCO2Saved} color="text-green-600" />
            <StatCard label="Pending Verifications" value={stats.pendingDriverVerifications} color="text-orange-500" />
          </div>
        )}

        {/* ═══ RIDES ═══ */}
        {tab === "rides" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <select
                value={rideStatus}
                onChange={(e) => {
                  setRideStatus(e.target.value);
                  fetchRides(e.target.value, 1);
                }}
                className="input-field w-auto"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="text-sm text-gray-500">{rideMeta.total} rides</span>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Source", "Destination", "Driver", "Departure", "Seats", "Price", "Status"].map(
                      (h) => (
                        <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rides.map((r) => (
                    <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{r.source?.name}</td>
                      <td className="py-3 px-2 font-medium">{r.destination?.name}</td>
                      <td className="py-3 px-2 text-gray-600">{r.driver?.name || "—"}</td>
                      <td className="py-3 px-2 text-gray-600">
                        {new Date(r.departureTime).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {r.availableSeats}/{r.totalSeats}
                      </td>
                      <td className="py-3 px-2 text-gray-600">₹{r.pricePerSeat}</td>
                      <td className="py-3 px-2">
                        <Badge text={r.status} variant={statusBadgeVariant(r.status)} />
                      </td>
                    </tr>
                  ))}
                  {rides.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        No rides found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {rideMeta.pages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: rideMeta.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchRides(rideStatus, p)}
                    className={`px-3 py-1 rounded text-sm ${
                      p === ridePage
                        ? "bg-primary-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ USERS ═══ */}
        {tab === "users" && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "Email", "Phone", "Role", "Trust", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{u.name}</td>
                    <td className="py-3 px-2 text-gray-600">{u.email}</td>
                    <td className="py-3 px-2 text-gray-600">{u.phone}</td>
                    <td className="py-3 px-2">
                      <Badge text={u.role} variant={u.role === "driver" ? "blue" : "gray"} />
                    </td>
                    <td className="py-3 px-2 text-gray-600">{u.trustScore}</td>
                    <td className="py-3 px-2">
                      <Badge
                        text={u.isActive ? "Active" : "Banned"}
                        variant={u.isActive ? "green" : "red"}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleUser(u._id, u.isActive)}
                          className={`text-xs px-3 py-1 rounded border cursor-pointer ${
                            u.isActive
                              ? "text-red-500 border-red-200 hover:bg-red-50"
                              : "text-green-600 border-green-200 hover:bg-green-50"
                          }`}
                        >
                          {u.isActive ? "Ban" : "Activate"}
                        </button>
                        <button
                          onClick={() => {
                            setTrustModal({ id: u._id, name: u.name, current: u.trustScore });
                            setTrustInput({ score: u.trustScore, reason: "" });
                          }}
                          className="text-xs px-3 py-1 rounded border border-purple-200 text-purple-600 hover:bg-purple-50 cursor-pointer"
                        >
                          Trust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ DRIVERS (verification) ═══ */}
        {tab === "drivers" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Manage driver verification. Click <strong>Verify / Reject</strong> to change a driver's status.
            </p>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Name", "Email", "Phone", "Trust", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{d.name}</td>
                      <td className="py-3 px-2 text-gray-600">{d.email}</td>
                      <td className="py-3 px-2 text-gray-600">{d.phone}</td>
                      <td className="py-3 px-2 text-gray-600">{d.trustScore}</td>
                      <td className="py-3 px-2">
                        <Badge
                          text={d.isActive ? "Active" : "Banned"}
                          variant={d.isActive ? "green" : "red"}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setVerifyModal({ id: d._id, name: d.name });
                              setVerifyInput({ status: "verified", note: "" });
                            }}
                            className="text-xs px-3 py-1 rounded border border-green-200 text-green-600 hover:bg-green-50 cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => {
                              setVerifyModal({ id: d._id, name: d.name });
                              setVerifyInput({ status: "rejected", note: "" });
                            }}
                            className="text-xs px-3 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => toggleUser(d._id, d.isActive)}
                            className={`text-xs px-3 py-1 rounded border cursor-pointer ${
                              d.isActive
                                ? "text-red-500 border-red-200 hover:bg-red-50"
                                : "text-green-600 border-green-200 hover:bg-green-50"
                            }`}
                          >
                            {d.isActive ? "Ban" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {drivers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══ ROUTES ═══ */}
        {tab === "routes" && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Source", "Destination", "Total Bookings", "Revenue (Rs.)", "Avg Price"].map(
                    (h) => (
                      <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{r.source}</td>
                    <td className="py-3 px-2 font-medium">{r.destination}</td>
                    <td className="py-3 px-2 text-gray-600">{r.totalBookings}</td>
                    <td className="py-3 px-2 text-gray-600">{r.totalRevenue}</td>
                    <td className="py-3 px-2 text-gray-600">{r.avgPrice}</td>
                  </tr>
                ))}
                {routes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No route data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ FRAUD / SUSPICIOUS ═══ */}
        {tab === "fraud" && (
          <div className="space-y-6">
            {/* Low trust score users */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Low Trust Score Users
              </h2>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Name", "Email", "Role", "Trust", "Rating", "Action"].map((h) => (
                        <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {suspicious.lowTrustUsers?.map((u) => (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{u.name}</td>
                        <td className="py-3 px-2 text-gray-600">{u.email}</td>
                        <td className="py-3 px-2">
                          <Badge text={u.role} />
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-red-600 font-semibold">{u.trustScore}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {u.averageRating > 0 ? `${u.averageRating} ★` : "—"}
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => toggleUser(u._id, true)}
                            className="text-xs px-3 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            Ban User
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!suspicious.lowTrustUsers || suspicious.lowTrustUsers.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-400">
                          No suspicious users found 🎉
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* High cancellation users */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                High Cancellation Users
              </h2>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Name", "Email", "Cancellations", "Trust Score", "Action"].map((h) => (
                        <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {suspicious.highCancellationUsers?.map((u) => (
                      <tr key={u.userId} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{u.name}</td>
                        <td className="py-3 px-2 text-gray-600">{u.email}</td>
                        <td className="py-3 px-2">
                          <span className="text-red-600 font-semibold">{u.cancellations}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{u.trustScore}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => toggleUser(u.userId, true)}
                            className="text-xs px-3 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            Ban User
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!suspicious.highCancellationUsers ||
                      suspicious.highCancellationUsers.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-400">
                          No high-cancellation users 🎉
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ TRUST SCORE MODAL ═══ */}
      {trustModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Adjust Trust Score</h3>
            <p className="text-sm text-gray-500 mb-4">
              {trustModal.name} — current score: <strong>{trustModal.current}</strong>
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Score (0 – 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={trustInput.score}
                  onChange={(e) => setTrustInput({ ...trustInput, score: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={trustInput.reason}
                  onChange={(e) => setTrustInput({ ...trustInput, reason: e.target.value })}
                  className="input-field"
                  placeholder="e.g. manual review"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={submitTrustScore} className="btn-primary flex-1">
                Update
              </button>
              <button
                onClick={() => setTrustModal(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DRIVER VERIFY MODAL ═══ */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {verifyInput.status === "verified" ? "Verify" : "Reject"} Driver
            </h3>
            <p className="text-sm text-gray-500 mb-4">{verifyModal.name}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={verifyInput.status}
                  onChange={(e) => setVerifyInput({ ...verifyInput, status: e.target.value })}
                  className="input-field"
                >
                  <option value="verified">Verify</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={verifyInput.note}
                  onChange={(e) => setVerifyInput({ ...verifyInput, note: e.target.value })}
                  className="input-field"
                  placeholder="e.g. documents verified successfully"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={submitVerifyDriver}
                className={`flex-1 font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                  verifyInput.status === "verified"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {verifyInput.status === "verified" ? "Verify Driver" : "Reject Driver"}
              </button>
              <button
                onClick={() => setVerifyModal(null)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
