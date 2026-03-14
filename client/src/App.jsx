import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore.js";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import Spinner from "./components/shared/Spinner.jsx";
import Toast from "./components/shared/Toast.jsx";
import SOSButton from "./components/shared/SOSButton.jsx";

// pages
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import SearchRides from "./pages/passenger/SearchRides.jsx";
import RideDetails from "./pages/passenger/RideDetails.jsx";
import MyBookings from "./pages/passenger/MyBookings.jsx";
import PostRide from "./pages/driver/PostRide.jsx";
import MyRides from "./pages/driver/MyRides.jsx";
import DriverOnboarding from "./pages/driver/DriverOnboarding.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Rewards from "./pages/Rewards.jsx";

const RootLayout = () => {
  const { getMe, initialized } = useAuthStore();
  useEffect(() => { getMe(); }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fffef5" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toast />
      <SOSButton />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <SearchRides /> },
      { path: "/rides/:id", element: <RideDetails /> },
      {
        element: <ProtectedRoute allowedRoles={["passenger"]} />,
        children: [{ path: "/my-bookings", element: <MyBookings /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["driver"]} />,
        children: [
          { path: "/post-ride", element: <PostRide /> },
          { path: "/my-rides", element: <MyRides /> },
          { path: "/onboarding", element: <DriverOnboarding /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [{ path: "/admin", element: <AdminDashboard /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["passenger", "driver", "admin"]} />,
        children: [{ path: "/rewards", element: <Rewards /> }],
      },
      {
        path: "*",
        element: (
          <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#fffef5" }}>
            <p className="text-9xl font-black mb-4" style={{ color: "#ffe156", WebkitTextStroke: "3px #1a1a1a" }}>404</p>
            <p className="text-xl font-black mb-1">PAGE NOT FOUND</p>
            <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        ),
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
