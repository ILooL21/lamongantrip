import { BarsOutlined, HomeOutlined, MailOutlined, SignatureOutlined, UserOutlined } from "@ant-design/icons";
import "../../styles/Dashboard.css";

const Sidebar = ({ activeMenu }) => {
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
        <div className={activeMenu === "destination" ? "isActive" : ""}>
          <a href="/admin/destination">
            <BarsOutlined className="icon-navbar-dashboard" />
            Tempat Wisata
          </a>
        </div>
        <div className={activeMenu === "news" ? "isActive" : ""}>
          <a href="/admin/news">
            <SignatureOutlined className="icon-navbar-dashboard" />
            Artikel
          </a>
        </div>
        <div className={activeMenu === "mails" ? "isActive" : ""}>
          <a href="/admin/mails">
            <MailOutlined className="icon-navbar-dashboard" />
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
