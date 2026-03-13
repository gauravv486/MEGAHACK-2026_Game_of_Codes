import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import { disconnectSocket } from "../../socket/socket.js";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        disconnectSocket();
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-primary-600">
                        SeatSync
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/search" className="text-sm text-gray-600 hover:text-primary-600">
                            Find Rides
                        </Link>

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {user.role === "driver" && (
                                    <Link to="/post-ride" className="text-sm text-gray-600 hover:text-primary-600">
                                        Post Ride
                                    </Link>
                                )}
                                {user.role === "driver" && (
                                    <Link to="/my-rides" className="text-sm text-gray-600 hover:text-primary-600">
                                        My Rides
                                    </Link>
                                )}
                                {user.role === "passenger" && (
                                    <Link to="/my-bookings" className="text-sm text-gray-600 hover:text-primary-600">
                                        My Bookings
                                    </Link>
                                )}
                                {user.role === "admin" && (
                                    <Link to="/admin" className="text-sm text-gray-600 hover:text-primary-600">
                                        Dashboard
                                    </Link>
                                )}

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-700">{user.name}</span>
                                </div>

                                <button onClick={handleLogout}
                                    className="text-sm text-red-500 hover:text-red-700">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
