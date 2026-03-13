import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore.js";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import Spinner from "./components/shared/Spinner.jsx";

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

// root layout — runs getMe once on app load
const RootLayout = () => {
  const { getMe, initialized } = useAuthStore();

  useEffect(() => {
    getMe();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // public routes
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <SearchRides /> },
      { path: "/rides/:id", element: <RideDetails /> },

      // passenger only
      {
        element: <ProtectedRoute allowedRoles={["passenger"]} />,
        children: [
          { path: "/my-bookings", element: <MyBookings /> },
        ],
      },

      // driver only
      {
        element: <ProtectedRoute allowedRoles={["driver"]} />,
        children: [
          { path: "/post-ride", element: <PostRide /> },
          { path: "/my-rides", element: <MyRides /> },
          { path: "/onboarding", element: <DriverOnboarding /> },
        ],
      },

      // admin only
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
        ],
      },

      // 404 fallback
      {
        path: "*",
        element: (
          <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
            <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
            <p className="text-lg font-medium">Page not found</p>
            <a href="/" className="mt-4 text-primary-600 hover:underline text-sm">
              Go back home
            </a>
          </div>
        ),
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
