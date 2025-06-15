import { useState, useEffect } from "react";
import { BarsOutlined, HomeOutlined, MailOutlined, SignatureOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, CompassOutlined } from "@ant-design/icons";
import { useCountMailQuery } from "../../slices/contactApiSlice";
import "../../styles/Dashboard.css";
import { Badge, Tooltip } from "antd";

const Sidebar = ({ activeMenu }) => {
  const { data: mailCount, isLoading } = useCountMailQuery();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial render

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        {collapsed ? (
          <Tooltip
            title="WisataID Admin"
            placement="right"></Tooltip>
        ) : (
          <div className="logo-full">
            <span>Lamongan Trip</span>
          </div>
        )}
        <button
          className="toggle-btn"
          onClick={toggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <div className="sidebar-menu">
        <Tooltip
          title={collapsed ? "Dashboard" : ""}
          placement="right">
          <div className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}>
            <a href="/admin/dashboard">
              <HomeOutlined className="menu-icon" />
              {!collapsed && <span className="menu-text">Dashboard</span>}
            </a>
          </div>
        </Tooltip>

        <Tooltip
          title={collapsed ? "Pengguna" : ""}
          placement="right">
          <div className={`menu-item ${activeMenu === "users" ? "active" : ""}`}>
            <a href="/admin/users">
              <UserOutlined className="menu-icon" />
              {!collapsed && <span className="menu-text">Pengguna</span>}
            </a>
          </div>
        </Tooltip>

        <Tooltip
          title={collapsed ? "Tempat Wisata" : ""}
          placement="right">
          <div className={`menu-item ${activeMenu === "destinations" ? "active" : ""}`}>
            <a href="/admin/destinations">
              <BarsOutlined className="menu-icon" />
              {!collapsed && <span className="menu-text">Tempat Wisata</span>}
            </a>
          </div>
        </Tooltip>

        <Tooltip
          title={collapsed ? "Artikel" : ""}
          placement="right">
          <div className={`menu-item ${activeMenu === "articles" ? "active" : ""}`}>
            <a href="/admin/articles">
              <SignatureOutlined className="menu-icon" />
              {!collapsed && <span className="menu-text">Artikel</span>}
            </a>
          </div>
        </Tooltip>

        <Tooltip
          title={collapsed ? "Email" : ""}
          placement="right">
          {" "}
          <div className={`menu-item ${activeMenu === "mails" ? "active" : ""}`}>
            <a href="/admin/mails">
              <MailOutlined className="menu-icon" />
              {!collapsed && (
                <>
                  <span className="menu-text">Email</span>
                  {!isLoading && mailCount > 0 && (
                    <Badge
                      count={mailCount}
                      className="mail-badge"
                    />
                  )}
                </>
              )}
            </a>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
