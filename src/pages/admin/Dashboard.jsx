import { Breadcrumb } from "antd";
import { useGetActiveUserDataQuery } from "../../slices/userApiSlice";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";

const Dasboard = () => {
  const { data: userInfo } = useGetActiveUserDataQuery();

  return (
    <>
      <Header />
      <div
        className="wrapper-body"
        style={{
          display: "flex",
        }}>
        <Sidebar activeMenu={"dashboard"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[
                {
                  title: <a href="/admin/dashboard">Home</a>,
                },
                {
                  title: "Dashboard",
                },
              ]}
            />
          </div>
          <div className="container-dashboard-main">
            <h2>Selamat Datang {userInfo.username}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dasboard;
