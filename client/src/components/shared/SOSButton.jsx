import { useState } from "react";
import useAuthStore from "../../store/useAuthStore.js";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const SOSButton = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Don't show for admin or if not logged in
  if (!user || user.role === "admin") return null;

  const handleSOS = async () => {
    setSending(true);
    try {
      let latitude, longitude;
      // Try to get location
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
          })
        );
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } catch {
        // Location not available, proceed without it
      }

      await api.post("/sos", {
        message: "Emergency SOS triggered",
        latitude,
        longitude,
      });

      addToast("SOS alert sent to admin! Help is on the way.", "success");
      setShowConfirm(false);
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to send SOS alert",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating SOS button — bottom right */}
      <button
        id="sos-btn"
        onClick={() => setShowConfirm(true)}
        onMouseEnter={() => setPulse(false)}
        onMouseLeave={() => setPulse(true)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9998,
          width: "64px",
          height: "64px",
          borderRadius: "0",
          background: "#ff4444",
          color: "#fff",
          border: "3px solid #1a1a1a",
          boxShadow: "5px 5px 0 #1a1a1a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          fontSize: "13px",
          letterSpacing: "0.05em",
          transition: "transform 0.15s, box-shadow 0.15s",
          animation: pulse ? "sos-pulse 2s ease-in-out infinite" : "none",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translate(-2px, -2px)";
          e.currentTarget.style.boxShadow = "7px 7px 0 #1a1a1a";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "5px 5px 0 #1a1a1a";
        }}
      >
        {/* Warning triangle icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: "2px" }}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        SOS
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => !sending && setShowConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fffef5",
              border: "3px solid #1a1a1a",
              boxShadow: "8px 8px 0 #1a1a1a",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              animation: "fadeUp 0.25s ease-out",
            }}
          >
            {/* Red alert header */}
            <div
              style={{
                background: "#ff4444",
                border: "3px solid #1a1a1a",
                boxShadow: "4px 4px 0 #1a1a1a",
                padding: "16px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 8px" }}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  margin: 0,
                }}
              >
                EMERGENCY SOS
              </p>
            </div>

            <p
              style={{
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#1a1a1a",
                marginBottom: "8px",
              }}
            >
              Are you sure you want to send an emergency SOS alert?
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                marginBottom: "24px",
                lineHeight: 1.5,
              }}
            >
              This will immediately notify all admins about your emergency. Your
              location will be shared if available.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={sending}
                className="btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSOS}
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "#ff4444",
                  color: "#fff",
                  border: "3px solid #1a1a1a",
                  boxShadow: "4px 4px 0 #1a1a1a",
                  fontWeight: 900,
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  cursor: sending ? "not-allowed" : "pointer",
                  opacity: sending ? 0.6 : 1,
                  transition: "all 0.15s",
                }}
              >
                {sending ? "SENDING..." : "SEND SOS"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 5px 5px 0 #1a1a1a, 0 0 0 0 rgba(255,68,68,0.5); }
          50% { box-shadow: 5px 5px 0 #1a1a1a, 0 0 0 10px rgba(255,68,68,0); }
        }
      `}</style>
    </>
  );
};

export default SOSButton;
