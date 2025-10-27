import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import UserListing from "./pages/UserListing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("forcePwdChange");
    localStorage.removeItem("consentAccepted");
    localStorage.removeItem("isGuestUser");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/users" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="users" element={<UserListing />} />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/users" replace />}
                  />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/admin/users" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
