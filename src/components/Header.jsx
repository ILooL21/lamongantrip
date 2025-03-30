import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { DownOutlined, UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useLazyGetActiveUserDataQuery } from "../slices/userApiSlice";
import img from "../assets/logo.jpeg";
import { useEffect } from "react";
import "../styles/Header.css";
import Swal from "sweetalert2";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const { isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getActiveUserData, { data: userInfo, error, isLoading }] = useLazyGetActiveUserDataQuery();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/auth");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isLogin) {
      getActiveUserData();
    }

    if (error && error.status === 401) {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const toggleCategoryDropdown = () => setIsCategoryDropdownOpen(!isCategoryDropdownOpen);

  return isLoading ? null : (
    <header className="header">
      <div className="header-container">
        <Link
          to="/"
          className="logo">
          <img
            src={img}
            alt="Logo"
            className="logo-image"
          />
        </Link>

        <button
          className="menu-toggle"
          onClick={toggleMenu}>
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/rekomendasi-wisata"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}>
            Rekomendasi Wisata
          </Link>

          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={toggleCategoryDropdown}>
              Spot Wisata <DownOutlined />
            </button>
            <div className={`dropdown-menu ${isCategoryDropdownOpen ? "active" : ""}`}>
              <Link
                to="/destination"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}>
                Semua Wisata
              </Link>
              <Link
                to="/destination?category=alam"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}>
                Wisata Alam
              </Link>
              <Link
                to="/destination?category=buatan"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}>
                Wisata Buatan
              </Link>
              <Link
                to="/destination?category=religi"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}>
                Wisata Religi
              </Link>
            </div>
          </div>

          <Link
            to="/articles"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}>
            Berita
          </Link>
          <Link
            to="/contact-us"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}>
            Kontak Kami
          </Link>

          {isLogin && userInfo ? (
            <div className="dropdown user-dropdown">
              <button
                className="dropdown-toggle"
                onClick={toggleUserDropdown}>
                <UserOutlined /> {userInfo?.username} <DownOutlined />
              </button>
              <div className={`dropdown-menu ${isUserDropdownOpen ? "active" : ""}`}>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                {userInfo?.role !== "user" && (
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <button
                  className="dropdown-item"
                  onClick={logoutHandler}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="nav-link auth-link"
              onClick={() => setIsMenuOpen(false)}>
              Masuk / Daftar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
