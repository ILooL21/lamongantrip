import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isLogin } = useSelector((state) => state.auth);

  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate
      to="/auth"
      replace
    />
  );
};

export default ProtectedRoute;
