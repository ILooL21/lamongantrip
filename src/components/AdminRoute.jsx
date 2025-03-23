import { Navigate, Outlet } from "react-router-dom";
import { useGetActiveUserDataQuery } from "../slices/userApiSlice";

const AdminRoute = () => {
  const { data, error, isLoading } = useGetActiveUserDataQuery();

  if (!isLoading) {
    if (error) {
      return <Navigate to="/auth" />;
    } else if (data?.role !== "admin") {
      return <Navigate to="/" />;
    } else {
      return <Outlet />;
    }
  }
};

export default AdminRoute;
