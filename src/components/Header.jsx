import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { DownOutlined, UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
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
    <header className="header">
      <div className="header-container">
        <Link
          to="/"
          className="logo"
          onClick={closeAllMenus}>
          <img
            src={img}
            alt="Logo"
            className="logo-image"
          />
        </Link>

        {/* BARU: Pasang ref pada tombol menu */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          ref={menuToggleRef}>
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        {/* BARU: Pasang ref pada nav menu */}
        <nav
          className={`nav-menu ${isMenuOpen ? "active" : ""}`}
          ref={menuRef}>
          <Link
            to="/rekomendasi-wisata"
            className="nav-link"
            onClick={closeAllMenus}>
            Rekomendasi Wisata
          </Link>

          <div
            className="dropdown"
            ref={categoryDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={toggleCategoryDropdown}>
              Tempat Wisata <DownOutlined />
            </button>
            <div className={`dropdown-menu ${isCategoryDropdownOpen ? "active" : ""}`}>
              <Link
                to="/destination/"
                className="dropdown-item"
                onClick={closeAllMenus}>
                Semua Wisata
              </Link>
              <Link
                to="/destination/alam"
                className="dropdown-item"
                onClick={closeAllMenus}>
                Wisata Alam
              </Link>
              <Link
                to="/destination/buatan"
                className="dropdown-item"
                onClick={closeAllMenus}>
                Wisata Buatan
              </Link>
              <Link
                to="/destination/religi"
                className="dropdown-item"
                onClick={closeAllMenus}>
                Wisata Religi
              </Link>
            </div>
          </div>

          <Link
            to="/articles"
            className="nav-link"
            onClick={closeAllMenus}>
            Artikel
          </Link>
          <Link
            to="/contact-us"
            className="nav-link"
            onClick={closeAllMenus}>
            Kontak Kami
          </Link>

          {isLogin && userInfo ? (
            <div
              className="dropdown user-dropdown"
              ref={userDropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={toggleUserDropdown}>
                <UserOutlined /> {userInfo?.username} <DownOutlined />
              </button>
              <div className={`dropdown-menu ${isUserDropdownOpen ? "active" : ""}`}>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={closeAllMenus}>
                  Profile
                </Link>
                {userInfo?.role !== "user" && (
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item"
                    onClick={closeAllMenus}>
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
              onClick={closeAllMenus}>
              Masuk / Daftar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
