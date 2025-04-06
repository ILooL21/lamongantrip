import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css"; // Pastikan kamu buat file ini juga

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! Halaman tidak ditemukan.</h2>
        <p className="notfound-text">Halaman yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <Link
          to="/"
          className="notfound-button">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
