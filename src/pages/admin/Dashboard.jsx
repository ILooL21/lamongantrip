import { Breadcrumb, Card, Statistic } from "antd";
import { useGetActiveUserDataQuery } from "../../slices/userApiSlice";
import { useGetAllUsersQuery } from "../../slices/userApiSlice";
import { useGetAllDestinationsQuery } from "../../slices/destinationApiSlice";
import { useGetAllArticleQuery } from "../../slices/articleApiSlice";
import { useCountMailQuery } from "../../slices/contactApiSlice";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import { UserOutlined, CompassOutlined, FileTextOutlined, MailOutlined, BarChartOutlined } from "@ant-design/icons";
import "../../styles/AdminPages.css";

const Dasboard = () => {
  const { data: userInfo } = useGetActiveUserDataQuery();
  const { data: users } = useGetAllUsersQuery();
  const { data: destinations } = useGetAllDestinationsQuery();
  const { data: articles } = useGetAllArticleQuery();
  const { data: mailCount } = useCountMailQuery();

  const totalUsers = users?.length || 0;
  const totalDestinations = destinations?.length || 0;
  const totalArticles = articles?.length || 0;
  const totalMails = mailCount || 0;
  return (
    <>
      <Header />
      <div className="admin-layout">
        <div className="wrapper-body">
          <Sidebar activeMenu={"dashboard"} />
          <div className="container-dashboard">
            <div className="container-dashboard-header">
              <div>
                <h1 className="admin-title">Dashboard</h1>
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
            </div>
            <div className="container-dashboard-main">
              <div className="dashboard-welcome">
                <h2>Selamat Datang, {userInfo?.username || "Admin"}!</h2>
                <p className="welcome-subtitle">Berikut adalah ringkasan data WisataID</p>
              </div>

              <div className="dashboard-stats">
                <Card className="stat-card">
                  <Statistic
                    title="Total Pengguna"
                    value={totalUsers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#007f73" }}
                  />
                </Card>

                <Card className="stat-card">
                  <Statistic
                    title="Tempat Wisata"
                    value={totalDestinations}
                    prefix={<CompassOutlined />}
                    valueStyle={{ color: "#007f73" }}
                  />
                </Card>

                <Card className="stat-card">
                  <Statistic
                    title="Artikel"
                    value={totalArticles}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: "#007f73" }}
                  />
                </Card>

                <Card className="stat-card">
                  <Statistic
                    title="Email Baru"
                    value={totalMails}
                    prefix={<MailOutlined />}
                    valueStyle={{ color: "#007f73" }}
                  />
                </Card>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dasboard;
