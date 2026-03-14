import { useState } from "react";
import api from "../../api/axios.js";

const PaymentModal = ({ booking, amount, onClose, onSuccess }) => {
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  // Format card number with spaces
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await api.post("/payments/pay", {
        bookingId: booking._id || booking,
        method,
        cardLast4: method === "card" ? card.number.replace(/\s/g, "").slice(-4) : null,
        upiId: method === "upi" ? upiId : null,
      });

      setSuccess(res.data.payment);
      if (onSuccess) onSuccess(res.data.payment);
    } catch (err) {
      setProcessing(false);
      alert(err.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-sm animate-fade-up" style={{ background: "#b8f3b0", border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a", padding: "40px 30px" }}>
          <div className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center"
              style={{ background: "#fff", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}>
              <span style={{ fontSize: "32px", color: "#2e7d32", fontWeight: 900 }}>OK</span>
            </div>
            <h2 className="text-2xl font-black mb-1">PAYMENT SUCCESSFUL</h2>
            <p className="text-sm font-bold text-gray-600 mb-4">Your ride is confirmed!</p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Amount</span>
                <span className="font-black">INR {success.amount}</span>
              </div>
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Transaction ID</span>
                <span className="font-bold text-xs">{success.transactionId}</span>
              </div>
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Method</span>
                <span className="font-bold text-sm">{success.method === "card" ? "Card" : "UPI"}</span>
              </div>
              <div className="flex justify-between p-2" style={{ background: "#fff", border: "2px solid #1a1a1a" }}>
                <span className="text-xs font-bold uppercase text-gray-500">Status</span>
                <span className="font-black" style={{ color: "#2e7d32" }}>RIDE BOOKED & PAID</span>
              </div>
            </div>

            <div className="p-3 mb-5" style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>
              <p className="text-xs font-black uppercase">Driver Notified</p>
              <p className="text-sm mt-0.5">Your driver has been notified. Ride is <strong>ACCEPTED</strong>!</p>
            </div>

            <button onClick={onClose} className="btn-primary w-full" style={{ background: "#1a1a1a", color: "#b8f3b0" }}>
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm animate-fade-up" style={{ background: "#fffef5", border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}>

        {/* Stripe-style header */}
        <div className="p-5" style={{ background: "#635BFF", borderBottom: "3px solid #1a1a1a" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center font-black text-white text-sm"
                style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>S</div>
              <span className="text-white font-black text-sm uppercase tracking-wider">Stripe Demo</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white font-black text-lg cursor-pointer">X</button>
          </div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Pay SeatSync</p>
          <p className="text-white text-4xl font-black">INR {amount}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Method Picker */}
          <div className="flex gap-2">
            {[
              { key: "card", label: "Card", bg: "#635BFF" },
              { key: "upi", label: "UPI", bg: "#dbb8ff" },
            ].map((m) => (
              <button key={m.key} onClick={() => setMethod(m.key)}
                className="flex-1 py-3 text-sm font-black uppercase tracking-wider cursor-pointer transition-all"
                style={{
                  background: method === m.key ? m.bg : "#fff",
                  color: method === m.key && m.key === "card" ? "#fff" : "#1a1a1a",
                  border: "2px solid #1a1a1a",
                  boxShadow: method === m.key ? "4px 4px 0 #1a1a1a" : "2px 2px 0 #1a1a1a",
                  transform: method === m.key ? "translate(-1px,-1px)" : "none",
                }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Card Form */}
          {method === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                  value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  className="input-field !text-base tracking-wider" />
                <p className="text-xs text-gray-400 mt-1">Demo mode: any card number works</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" maxLength={5}
                    value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">CVC</label>
                  <input type="password" placeholder="***" maxLength={4}
                    value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">Cardholder Name</label>
                <input type="text" placeholder="Full name on card"
                  value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="input-field" />
              </div>
            </div>
          )}

          {/* UPI Form */}
          {method === "upi" && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1">UPI ID</label>
              <input type="text" placeholder="yourname@upi"
                value={upiId} onChange={(e) => setUpiId(e.target.value)}
                className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Demo mode: any UPI ID works</p>
            </div>
          )}

          {/* Pay Button */}
          <button onClick={handlePay} className="w-full py-4 font-black uppercase tracking-wider text-sm cursor-pointer transition-all"
            disabled={processing}
            style={{
              background: processing ? "#4b45c7" : "#635BFF",
              color: "#fff",
              border: "3px solid #1a1a1a",
              boxShadow: processing ? "0 0 0 #1a1a1a" : "4px 4px 0 #1a1a1a",
              transform: processing ? "translate(2px, 2px)" : "none",
            }}>
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-bounce-brutal">.</span>
                <span className="inline-block animate-bounce-brutal" style={{ animationDelay: "0.1s" }}>.</span>
                <span className="inline-block animate-bounce-brutal" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="ml-2">Processing Payment...</span>
              </span>
            ) : `Pay INR ${amount}`}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Powered by <strong>Stripe</strong> — Demo Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
