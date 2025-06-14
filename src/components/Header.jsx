import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { DownOutlined, UserOutlined, MenuOutlined, CloseOutlined, CompassOutlined, EnvironmentOutlined, ReadOutlined, PhoneOutlined, StarOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useLazyGetActiveUserDataQuery } from "../slices/userApiSlice";
import img from "../assets/logo.png";
import "../styles/Header.css";
import Swal from "sweetalert2";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Refs untuk dropdown dan menu
  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const menuRef = useRef(null); // BARU: Ref untuk nav-menu
  const menuToggleRef = useRef(null); // BARU: Ref untuk tombol menu toggle

  const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getActiveUserData, { data: userInfo, error, isLoading }] = useLazyGetActiveUserDataQuery();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/auth");
    closeAllMenus();
  };

  useEffect(() => {
    if (isLogin) {
      getActiveUserData();
    }

    if (error && (error.status === 401 || error.status === 404)) {
      dispatch(logout());
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Sesi Anda telah berakhir, silakan login kembali",
      }).then((isConfirmed) => {
        if (isConfirmed) navigate("/auth");
      });
    }
  }, [isLogin, getActiveUserData, dispatch, navigate, error]);

  // MODIFIKASI: useEffect untuk menangani klik di luar semua elemen interaktif
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logika untuk menutup user dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      // Logika untuk menutup category dropdown
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      // BARU: Logika untuk menutup menu mobile
      // Cek apakah klik terjadi di luar menu DAN di luar tombol toggle-nya
      if (menuRef.current && !menuRef.current.contains(event.target) && menuToggleRef.current && !menuToggleRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Dependency array tetap kosong agar hanya berjalan sekali

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
  };
  return isLoading ? null : (
    <header className="header-modern">
      <div className="header-container-modern">
        {/* Logo Section */}
        <Link
          to="/"
          className="logo-modern"
          onClick={closeAllMenus}>
          <img
            src={img}
            alt="Lamongan Trip Logo"
            className="logo-image-modern"
          />
          <div className="logo-text">
            <span className="logo-title">Lamongan Trip</span>
            <span className="logo-subtitle">Jelajahi Keindahan</span>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle-modern"
          onClick={toggleMenu}
          ref={menuToggleRef}
          aria-label="Toggle Navigation Menu">
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`nav-menu-modern ${isMenuOpen ? "active" : ""}`}
          ref={menuRef}>
          {/* Rekomendasi Wisata */}
          <Link
            to="/rekomendasi-wisata"
            className="nav-link-modern highlight"
            onClick={closeAllMenus}>
            <StarOutlined className="nav-icon" />
            <span>Rekomendasi Wisata</span>
          </Link>

          {/* Tempat Wisata Dropdown */}
          <div
            className="dropdown-modern"
            ref={categoryDropdownRef}>
            <button
              className="dropdown-toggle-modern"
              onClick={toggleCategoryDropdown}>
              <EnvironmentOutlined className="nav-icon" />
              <span>Tempat Wisata</span>
              <DownOutlined className="dropdown-arrow" />
            </button>
            <div className={`dropdown-menu-modern ${isCategoryDropdownOpen ? "active" : ""}`}>
              <Link
                to="/destination/"
                className="dropdown-item-modern"
                onClick={closeAllMenus}>
                <CompassOutlined className="dropdown-icon" />
                <div className="dropdown-content">
                  <span className="dropdown-title">Semua Wisata</span>
                  <span className="dropdown-desc">Jelajahi semua destinasi</span>
                </div>
              </Link>
              <Link
                to="/destination/alam"
                className="dropdown-item-modern"
                onClick={closeAllMenus}>
                <div className="dropdown-icon nature">🌿</div>
                <div className="dropdown-content">
                  <span className="dropdown-title">Wisata Alam</span>
                  <span className="dropdown-desc">Keindahan alam yang menawan</span>
                </div>
              </Link>
              <Link
                to="/destination/buatan"
                className="dropdown-item-modern"
                onClick={closeAllMenus}>
                <div className="dropdown-icon manmade">🏛️</div>
                <div className="dropdown-content">
                  <span className="dropdown-title">Wisata Buatan</span>
                  <span className="dropdown-desc">Destinasi buatan manusia</span>
                </div>
              </Link>
              <Link
                to="/destination/religi"
                className="dropdown-item-modern"
                onClick={closeAllMenus}>
                <div className="dropdown-icon religious">🕌</div>
                <div className="dropdown-content">
                  <span className="dropdown-title">Wisata Religi</span>
                  <span className="dropdown-desc">Tempat spiritual bersejarah</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Artikel */}
          <Link
            to="/articles"
            className="nav-link-modern"
            onClick={closeAllMenus}>
            <ReadOutlined className="nav-icon" />
            <span>Artikel</span>
          </Link>

          {/* Kontak */}
          <Link
            to="/contact-us"
            className="nav-link-modern"
            onClick={closeAllMenus}>
            <PhoneOutlined className="nav-icon" />
            <span>Kontak Kami</span>
          </Link>

          {/* User Menu / Auth */}
          {isLogin && userInfo ? (
            <div
              className="dropdown-modern user-dropdown-modern"
              ref={userDropdownRef}>
              <button
                className="dropdown-toggle-modern user-toggle"
                onClick={toggleUserDropdown}>
                <div className="user-avatar">
                  <UserOutlined />
                </div>
                <div className="user-info">
                  <span className="user-name">{userInfo?.username}</span>
                  <span className="user-role">{userInfo?.role}</span>
                </div>
                <DownOutlined className="dropdown-arrow" />
              </button>
              <div className={`dropdown-menu-modern user-menu ${isUserDropdownOpen ? "active" : ""}`}>
                <Link
                  to="/profile"
                  className="dropdown-item-modern"
                  onClick={closeAllMenus}>
                  <UserOutlined className="dropdown-icon" />
                  <div className="dropdown-content">
                    <span className="dropdown-title">Profile</span>
                    <span className="dropdown-desc">Kelola profil Anda</span>
                  </div>
                </Link>
                {userInfo?.role !== "user" && (
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item-modern"
                    onClick={closeAllMenus}>
                    <DashboardOutlined className="dropdown-icon" />
                    <div className="dropdown-content">
                      <span className="dropdown-title">Dashboard</span>
                      <span className="dropdown-desc">Panel administrasi</span>
                    </div>
                  </Link>
                )}
                <button
                  className="dropdown-item-modern logout-btn"
                  onClick={logoutHandler}>
                  <LogoutOutlined className="dropdown-icon" />
                  <div className="dropdown-content">
                    <span
                      className="dropdown-title"
                      style={{
                        textAlign: "start",
                      }}>
                      Logout
                    </span>
                    <span className="dropdown-desc">Keluar dari akun</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="auth-button-modern"
              onClick={closeAllMenus}>
              <UserOutlined className="auth-icon" />
              <span>Masuk / Daftar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
