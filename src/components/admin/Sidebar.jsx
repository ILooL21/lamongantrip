import { BarsOutlined, HomeOutlined, MailOutlined, SignatureOutlined, UserOutlined } from "@ant-design/icons";
import { useCountMailQuery } from "../../slices/contactApiSlice";
import "../../styles/Dashboard.css";
import { Badge } from "antd";

const Sidebar = ({ activeMenu }) => {
  const { data: mailCount, isLoading } = useCountMailQuery();

  return (
    <div className="container-navbar-dashboard">
      <div className="navbar-dashboard-list">
        <div className={activeMenu === "dashboard" ? "isActive" : ""}>
          <a href="/admin/dashboard">
            <HomeOutlined className="icon-navbar-dashboard" />
            Dashboard
          </a>
        </div>
        <div className={activeMenu === "users" ? "isActive" : ""}>
          <a href="/admin/users">
            <UserOutlined className="icon-navbar-dashboard" />
            Pengguna
          </a>
        </div>
        <div className={activeMenu === "destinations" ? "isActive" : ""}>
          <a href="/admin/destinations">
            <BarsOutlined className="icon-navbar-dashboard" />
            Tempat Wisata
          </a>
        </div>
        <div className={activeMenu === "articles" ? "isActive" : ""}>
          <a href="/admin/articles">
            <SignatureOutlined className="icon-navbar-dashboard" />
            Artikel
          </a>
        </div>
        <div className={activeMenu === "mails" ? "isActive" : ""}>
          <a
            href="/admin/mails"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", paddingInline: "0" }}>
              <MailOutlined className="icon-navbar-dashboard" />
              <span>Email</span>
            </div>
            {!isLoading && mailCount > 0 && <Badge count={mailCount} />}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
