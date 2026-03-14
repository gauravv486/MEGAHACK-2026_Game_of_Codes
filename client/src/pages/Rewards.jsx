import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import Spinner from "../components/shared/Spinner.jsx";
import useToastStore from "../store/useToastStore.js";
import api from "../api/axios.js";

const Rewards = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    api.get("/rewards/wallet")
      .then((res) => { setWallet(res.data.wallet); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRedeem = async () => {
    setRedeeming(true);
    try {
      const res = await api.post("/rewards/redeem");
      addToast(res.data.message, "success");
      const w = await api.get("/rewards/wallet");
      setWallet(w.data.wallet);
    } catch (err) {
      addToast(err.response?.data?.message || "Redemption failed", "error");
    } finally { setRedeeming(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  const balance = wallet?.balance || 0;
  const progress = Math.min(100, (balance / 500) * 100);
  const tokensNeeded = Math.max(0, 500 - balance);

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-fade-up mb-8">
          <div className="badge badge-orange inline-block mb-2">Rewards</div>
          <h1 className="text-3xl font-black">RIDE TOKENS</h1>
          <p className="text-sm text-gray-500 mt-0.5">Earn tokens for every ride. Redeem for exciting rewards!</p>
        </div>

        {/* Token Balance Card */}
        <div className="card-yellow p-8 mb-6 animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-600">Your Balance</p>
              <p className="text-6xl font-black">{balance}</p>
              <p className="text-sm font-bold mt-1">TOKENS</p>
            </div>
            <div className="w-16 h-16 flex items-center justify-center font-black text-2xl"
              style={{ background: "#fff", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}>T</div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-1">
              <span>Progress to Coupon</span>
              <span>{balance} / 500</span>
            </div>
            <div style={{ height: "16px", background: "#fff", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#1a1a1a", transition: "width 0.5s ease" }} />
            </div>
            {tokensNeeded > 0 && (
              <p className="text-xs mt-1 font-bold text-gray-600">{tokensNeeded} more tokens to unlock INR 200 coupon</p>
            )}
          </div>

          {balance >= 500 && (
            <button onClick={handleRedeem} disabled={redeeming} className="btn-primary w-full mt-4" style={{ background: "#1a1a1a", color: "#ffe156" }}>
              {redeeming ? "Redeeming..." : "Redeem INR 200 Coupon (500 Tokens)"}
            </button>
          )}
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { num: "01", title: "RIDE", desc: "Complete rides as driver or passenger", bg: "card-blue" },
            { num: "02", title: "EARN", desc: "1 token per 10 km traveled", bg: "card-green" },
            { num: "03", title: "REDEEM", desc: "500 tokens = INR 200 coupon", bg: "card-pink" },
          ].map((s, i) => (
            <div key={s.title} className={`${s.bg} p-5 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s`, border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
              <p className="text-3xl font-black" style={{ opacity: 0.2 }}>{s.num}</p>
              <h3 className="font-black mt-2 mb-1">{s.title}</h3>
              <p className="text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card p-5 animate-fade-up text-center">
            <p className="text-3xl font-black">{wallet?.totalEarned || 0}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">Total Earned</p>
          </div>
          <div className="card p-5 animate-fade-up text-center" style={{ animationDelay: "0.1s" }}>
            <p className="text-3xl font-black">{wallet?.totalRedeemed || 0}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">Total Redeemed</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="animate-fade-up-delay">
          <h2 className="font-black uppercase tracking-wider text-sm mb-4">Transaction History</h2>
          {(!wallet?.transactions || wallet.transactions.length === 0) ? (
            <div className="card text-center py-12">
              <p className="text-4xl font-black mb-2" style={{ opacity: 0.1 }}>0</p>
              <p className="font-black">NO TRANSACTIONS YET</p>
              <p className="text-sm text-gray-500 mt-1">Complete rides to start earning tokens</p>
            </div>
          ) : (
            <div className="space-y-2">
              {wallet.transactions.map((tx, i) => (
                <div key={i} className="card !p-4" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center text-lg font-black"
                        style={{
                          background: tx.type === "earned" ? "#b8f3b0" : "#ff8fab",
                          border: "2px solid #1a1a1a",
                          boxShadow: "2px 2px 0 #1a1a1a",
                        }}>
                        {tx.type === "earned" ? "+" : "-"}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{tx.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-black"
                      style={{ color: tx.type === "earned" ? "#2e7d32" : "#dc2626" }}>
                      {tx.type === "earned" ? "+" : "-"}{tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
