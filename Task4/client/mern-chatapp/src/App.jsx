import { Routes, Route, Navigate } from "react-router-dom";

import Authentication from "./pages/authentication.page";
import Dashboard from "./pages/dashboard.page";
import "./App.css";

const ProtectedRoutes = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to="/users/signin" />;
  } else if (
    isLoggedIn &&
    ["/users/signin", "/users/signup"].includes(window.location.pathname)
  ) {
    return <Navigate to="/" />;
  }
  return children;
};

const App = () => {
  return (
    <div className="bg-[#334155] h-screen flex justify-center items-center">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes auth={true}>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/users/signin"
          element={
            <ProtectedRoutes>
              <Authentication isSignIn={true} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/users/signup"
          element={
            <ProtectedRoutes>
              <Authentication isSignIn={false} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
