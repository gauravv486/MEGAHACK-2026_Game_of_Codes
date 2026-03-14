import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50" style={{
      background: "#fffef5",
      borderBottom: "3px solid #1a1a1a",
    }}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter">
          SEAT<span style={{ background: "#ffe156", padding: "0 4px", border: "2px solid #1a1a1a" }}>SYNC</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <Link to="/search" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors border-b-2 border-transparent hover:border-black">
              Find Rides
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 !text-xs">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user.role === "driver" && (
                <>
                  <Link to="/post-ride" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">
                    Post Ride
                  </Link>
                  <Link to="/my-rides" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">
                    My Rides
                  </Link>
                </>
              )}
              {user.role === "passenger" && (
                <Link to="/my-bookings" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">
                  Bookings
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm font-bold uppercase tracking-wider hover:bg-yellow-200 px-3 py-1 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/rewards" className="text-sm font-bold uppercase tracking-wider hover:bg-orange-200 px-3 py-1 transition-colors flex items-center gap-1">
                Rewards
              </Link>
              <button onClick={handleLogout}
                className="text-sm font-bold uppercase tracking-wider hover:bg-red-200 px-3 py-1 transition-colors cursor-pointer">
                Logout
              </button>
              <div className="w-9 h-9 flex items-center justify-center text-sm font-black"
                style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
