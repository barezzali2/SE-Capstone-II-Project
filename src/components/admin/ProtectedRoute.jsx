import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Loading from "../Loading";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading, tokenVerified } = useAuth();
  const location = useLocation();
  const [waitingForVerification, setWaitingForVerification] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setWaitingForVerification(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const hasToken = localStorage.getItem("token") !== null;

  if (loading || waitingForVerification) {
    return <Loading />;
  }

  if (
    (!user && !hasToken) ||
    (!loading &&
      waitingForVerification === false &&
      !tokenVerified &&
      !hasToken)
  ) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
