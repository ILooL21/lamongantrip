import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! Halaman tidak ditemukan.</h2>
        <p className="notfound-text">Halaman yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <div className="notfound-buttons">
          <button
            className="notfound-button"
            onClick={handleBack}>
            🔙 Kembali Sebelumnya
          </button>
          <Link
            to="/"
            className="notfound-button">
            🏠 Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
