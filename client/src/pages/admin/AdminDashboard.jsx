import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const TABS = ["overview", "rides", "users", "drivers", "routes", "fraud"];
const statusBadge = { scheduled: "badge-green", ongoing: "badge-yellow", completed: "badge-gray", cancelled: "badge-red" };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [suspicious, setSuspicious] = useState({ lowTrustUsers: [], highCancellationUsers: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [rideStatus, setRideStatus] = useState("");
  const [rideMeta, setRideMeta] = useState({ total: 0 });
  const [trustModal, setTrustModal] = useState(null);
  const [trustInput, setTrustInput] = useState({ score: "", reason: "" });
  const [verifyModal, setVerifyModal] = useState(null);
  const [verifyInput, setVerifyInput] = useState({ status: "verified", note: "" });
  const { addToast } = useToastStore();

  const fetchDashboard = async () => {
    try {
      const [a, b, c, d] = await Promise.all([
        api.get("/admin/dashboard"), api.get("/admin/users?limit=50"),
        api.get("/admin/analytics/popular-routes"), api.get("/admin/fraud/suspicious-users"),
      ]);
      setStats(a.data.stats); setUsers(b.data.users); setRoutes(c.data.routes); setSuspicious(d.data);
    } catch(e){console.error(e)} finally { setLoading(false); }
  };
  const fetchRides = async (status = rideStatus) => {
    try { const r = await api.get("/admin/rides", { params: { limit: 15, ...(status ? { status } : {}) } }); setRides(r.data.rides); setRideMeta({ total: r.data.total }); } catch(e){console.error(e)}
  };
  const fetchDrivers = async () => { try { const r = await api.get("/admin/users?role=driver&limit=50"); setDrivers(r.data.users); } catch(e){} };

  useEffect(() => { fetchDashboard(); fetchRides(); fetchDrivers(); }, []);

  const toggleUser = async (id, isActive) => {
    await api.put(isActive ? `/admin/users/${id}/deactivate` : `/admin/users/${id}/activate`);
    const update = (arr) => arr.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u));
    setUsers(update); setDrivers(update);
    addToast(isActive ? "User banned" : "User activated", "info");
  };

  const submitTrust = async () => {
    if (!trustModal) return;
    try {
      await api.put(`/admin/users/${trustModal.id}/trust-score`, { score: Number(trustInput.score), reason: trustInput.reason });
      setUsers((prev) => prev.map((u) => (u._id === trustModal.id ? { ...u, trustScore: Number(trustInput.score) } : u)));
      setTrustModal(null); addToast("Trust score updated", "success");
    } catch { addToast("Failed", "error"); }
  };

  const submitVerify = async () => {
    if (!verifyModal) return;
    try {
      await api.put(`/admin/drivers/${verifyModal.id}/verify`, verifyInput);
      await fetchDrivers(); setVerifyModal(null); addToast(`Driver ${verifyInput.status}`, "success");
    } catch { addToast("Failed", "error"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-6 animate-fade-up">ADMIN DASHBOARD</h1>

        <div className="flex gap-2 mb-8 flex-wrap animate-fade-up">
          {TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); if(t==="rides")fetchRides(); if(t==="drivers")fetchDrivers(); }}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest cursor-pointer transition-all"
              style={{
                background: tab === t ? "#ffe156" : "#fff",
                border: "2px solid #1a1a1a",
                boxShadow: tab === t ? "4px 4px 0 #1a1a1a" : "2px 2px 0 #1a1a1a",
                transform: tab === t ? "translate(-1px,-1px)" : "none",
              }}>{t}</button>
          ))}
        </div>

        {tab === "overview" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
            {[
              { l: "Users", v: stats.totalUsers, bg: "card-blue" }, { l: "Drivers", v: stats.totalDrivers, bg: "card-yellow" },
              { l: "Total Rides", v: stats.totalRides, bg: "card-green" }, { l: "Active Rides", v: stats.activeRides, bg: "card-pink" },
              { l: "Bookings", v: stats.totalBookings, bg: "card-orange" }, { l: "Pending", v: stats.pendingBookings, bg: "card-yellow" },
              { l: "Completed", v: stats.completedBookings, bg: "card-green" }, { l: "Revenue (INR)", v: stats.totalRevenue, bg: "card-lilac" },
              { l: "New (7d)", v: stats.newUsersThisWeek, bg: "card-blue" }, { l: "CO2 Saved", v: Math.round(stats.totalCO2Saved)+"kg", bg: "card-green" },
              { l: "Cancelled", v: stats.cancelledBookings, bg: "card-pink" }, { l: "Pending Verifs", v: stats.pendingDriverVerifications, bg: "card-orange" },
            ].map((s, i) => (
              <div key={s.l} className={`${s.bg} p-4`} style={{ border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", animationDelay: `${i*0.04}s` }}>
                <p className="text-2xl font-black">{s.v ?? "---"}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "rides" && (<>
          <div className="flex items-center gap-3 mb-4 animate-fade-up">
            <select value={rideStatus} onChange={(e)=>{setRideStatus(e.target.value);fetchRides(e.target.value);}} className="input-field w-auto !py-2">
              <option value="">All</option><option value="scheduled">Scheduled</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm font-bold text-gray-500">{rideMeta.total} rides</span>
          </div>
          <div className="overflow-x-auto animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <table className="w-full text-sm text-left"><thead><tr>{["Source","Dest","Driver","Departure","Seats","Price","Status"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{rides.map(r=><tr key={r._id}>
                <td className="py-3 px-4 font-bold">{r.source?.name}</td><td className="py-3 px-4 font-bold">{r.destination?.name}</td>
                <td className="py-3 px-4 text-gray-500">{r.driver?.name||"---"}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(r.departureTime).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</td>
                <td className="py-3 px-4">{r.availableSeats}/{r.totalSeats}</td>
                <td className="py-3 px-4 font-black">INR {r.pricePerSeat}</td>
                <td className="py-3 px-4"><span className={`badge ${statusBadge[r.status]||"badge-gray"}`}>{r.status}</span></td>
              </tr>)}</tbody></table>
          </div>
        </>)}

        {tab === "users" && (
          <div className="overflow-x-auto animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <table className="w-full text-sm text-left"><thead><tr>{["Name","Email","Role","Trust","Status","Actions"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{users.map(u=><tr key={u._id}>
                <td className="py-3 px-4 font-bold">{u.name}</td><td className="py-3 px-4 text-gray-500">{u.email}</td>
                <td className="py-3 px-4"><span className={`badge ${u.role==="driver"?"badge-blue":"badge-gray"}`}>{u.role}</span></td>
                <td className="py-3 px-4 font-black">{u.trustScore}</td>
                <td className="py-3 px-4"><span className={`badge ${u.isActive?"badge-green":"badge-red"}`}>{u.isActive?"Active":"Banned"}</span></td>
                <td className="py-3 px-4"><div className="flex gap-2">
                  <button onClick={()=>toggleUser(u._id,u.isActive)} className={u.isActive?"btn-danger":"btn-primary"} style={{ fontSize:"11px", padding:"4px 10px" }}>{u.isActive?"Ban":"Activate"}</button>
                  <button onClick={()=>{setTrustModal({id:u._id,name:u.name,current:u.trustScore});setTrustInput({score:u.trustScore,reason:""});}} className="btn-outline" style={{ fontSize:"11px", padding:"4px 10px" }}>Trust</button>
                </div></td>
              </tr>)}</tbody></table>
          </div>
        )}

        {tab === "drivers" && (
          <div className="overflow-x-auto animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <table className="w-full text-sm text-left"><thead><tr>{["Name","Email","Trust","Status","Actions"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{drivers.map(d=><tr key={d._id}>
                <td className="py-3 px-4 font-bold">{d.name}</td><td className="py-3 px-4 text-gray-500">{d.email}</td>
                <td className="py-3 px-4 font-black">{d.trustScore}</td>
                <td className="py-3 px-4"><span className={`badge ${d.isActive?"badge-green":"badge-red"}`}>{d.isActive?"Active":"Banned"}</span></td>
                <td className="py-3 px-4"><div className="flex gap-2">
                  <button onClick={()=>{setVerifyModal({id:d._id,name:d.name});setVerifyInput({status:"verified",note:""});}} className="btn-primary" style={{ fontSize:"11px", padding:"4px 10px" }}>Verify</button>
                  <button onClick={()=>{setVerifyModal({id:d._id,name:d.name});setVerifyInput({status:"rejected",note:""});}} className="btn-danger" style={{ fontSize:"11px", padding:"4px 10px" }}>Reject</button>
                </div></td>
              </tr>)}</tbody></table>
          </div>
        )}

        {tab === "routes" && (
          <div className="overflow-x-auto animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <table className="w-full text-sm text-left"><thead><tr>{["Source","Destination","Bookings","Revenue","Avg Price"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{routes.map((r,i)=><tr key={i}>
                <td className="py-3 px-4 font-bold">{r.source}</td><td className="py-3 px-4 font-bold">{r.destination}</td>
                <td className="py-3 px-4">{r.totalBookings}</td><td className="py-3 px-4">{r.totalRevenue}</td>
                <td className="py-3 px-4 font-black">INR {r.avgPrice}</td>
              </tr>)}</tbody></table>
          </div>
        )}

        {tab === "fraud" && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h2 className="text-xl font-black mb-3">LOW TRUST USERS</h2>
              <div className="overflow-x-auto" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
                <table className="w-full text-sm text-left"><thead><tr>{["Name","Email","Role","Trust","Action"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
                  <tbody>{suspicious.lowTrustUsers?.map(u=><tr key={u._id}>
                    <td className="py-3 px-4 font-bold">{u.name}</td><td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4"><span className="badge badge-gray">{u.role}</span></td>
                    <td className="py-3 px-4 font-black" style={{color:"#dc2626"}}>{u.trustScore}</td>
                    <td className="py-3 px-4"><button onClick={()=>toggleUser(u._id,true)} className="btn-danger" style={{fontSize:"11px",padding:"4px 10px"}}>Ban</button></td>
                  </tr>)}</tbody></table>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black mb-3">HIGH CANCELLATIONS</h2>
              <div className="overflow-x-auto" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
                <table className="w-full text-sm text-left"><thead><tr>{["Name","Email","Cancellations","Trust","Action"].map(h=><th key={h} className="py-3 px-4 font-black uppercase text-xs tracking-wider">{h}</th>)}</tr></thead>
                  <tbody>{suspicious.highCancellationUsers?.map(u=><tr key={u.userId}>
                    <td className="py-3 px-4 font-bold">{u.name}</td><td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4 font-black" style={{color:"#dc2626"}}>{u.cancellations}</td>
                    <td className="py-3 px-4">{u.trustScore}</td>
                    <td className="py-3 px-4"><button onClick={()=>toggleUser(u.userId,true)} className="btn-danger" style={{fontSize:"11px",padding:"4px 10px"}}>Ban</button></td>
                  </tr>)}</tbody></table>
              </div>
            </div>
          </div>
        )}
      </div>

      {trustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card w-full max-w-sm p-6" style={{ background: "#fffef5" }}>
            <h3 className="text-xl font-black mb-1">ADJUST TRUST</h3>
            <p className="text-sm text-gray-500 mb-4">{trustModal.name} / Current: <strong>{trustModal.current}</strong></p>
            <div className="space-y-3">
              <div><label className="block text-sm font-black uppercase mb-1">Score (0-100)</label><input type="number" min="0" max="100" value={trustInput.score} onChange={(e)=>setTrustInput({...trustInput,score:e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-black uppercase mb-1">Reason</label><input type="text" value={trustInput.reason} onChange={(e)=>setTrustInput({...trustInput,reason:e.target.value})} className="input-field" /></div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={()=>setTrustModal(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={submitTrust} className="flex-1 btn-primary">Update</button>
            </div>
          </div>
        </div>
      )}

      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card w-full max-w-sm p-6" style={{ background: "#fffef5" }}>
            <h3 className="text-xl font-black mb-1">{verifyInput.status==="verified"?"VERIFY":"REJECT"} DRIVER</h3>
            <p className="text-sm text-gray-500 mb-4">{verifyModal.name}</p>
            <div className="space-y-3">
              <div><label className="block text-sm font-black uppercase mb-1">Action</label><select value={verifyInput.status} onChange={(e)=>setVerifyInput({...verifyInput,status:e.target.value})} className="input-field"><option value="verified">Verify</option><option value="rejected">Reject</option></select></div>
              <div><label className="block text-sm font-black uppercase mb-1">Note</label><input type="text" value={verifyInput.note} onChange={(e)=>setVerifyInput({...verifyInput,note:e.target.value})} className="input-field" /></div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={()=>setVerifyModal(null)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={submitVerify} className="flex-1 btn-primary">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
