import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! Halaman tidak ditemukan.</h2>
        <p className="notfound-text">Halaman yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <div className="notfound-buttons">
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
