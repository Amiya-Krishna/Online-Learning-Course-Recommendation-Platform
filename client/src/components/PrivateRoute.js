import { Navigate, useLocation } from "react-router-dom";

import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <Loader label="Restoring your session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default PrivateRoute;
