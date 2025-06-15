import Header from "../components/Header";
import "../styles/HomePages.css";
import { Link } from "react-router-dom";
import { useGetLatestArticleQuery } from "../slices/articleApiSlice";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";
import img from "../assets/tugu.jpg";
import alami from "../assets/alam.jpeg";
import religi from "../assets/religi.webp";
import buatan from "../assets/buatan.webp";
import alun from "../assets/alun.jpg";
import { ArrowRightOutlined } from "@ant-design/icons";

const HomePages = () => {
  const { data, error, isLoading } = useGetLatestArticleQuery();

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <section
        className="hero-section hero-bg"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div
          className="hero-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />
        <div
          className="hero-text"
          style={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
            textAlign: "center",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Ayo Jelajahi Keindahan Lamongan!</h2>
          <p style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 24px" }}>
            Liburan di Lamongan? Kenapa nggak! Mulai dari wisata alam yang menyegarkan hingga spot unik yang Instagramable, semua ada di sini. Yuk, rencanakan petualanganmu dan temukan tempat-tempat seru di Lamongan!
          </p>
          <a
            href="/rekomendasi-wisata"
            className="btn-selengkapnya"
            style={{ fontSize: 18, padding: "12px 32px", borderRadius: 8 }}>
            Dapatkan Rekomendasi
          </a>
        </div>
      </section>
      <InstallButton />
      {/* Tentang Website */}
      <section className="tentang-section">
        <div className="about-img-container">
          <img
            src={alun}
            alt="Tentang Lamongan"
            className="about-img"
          />
        </div>
        <div className="about-content">
          <div className="about-greeting">Hallo, Rek!</div>
          <h2>
            <span className="about-highlight">Lamongan Trip hadir</span> untuk mengajak kita semua mendukung pariwisata lokal, sambil bersama-sama melindungi warisan budaya dan kekayaan alam yang kita miliki.
          </h2>
          <p>
            Ini bukan sekadar website biasa. Kami menggunakan teknologi <strong>machine learning</strong> untuk memberikan rekomendasi wisata yang paling cocok untuk Anda. Cukup beritahu kami apa yang Anda cari (ingin santai, seru-seruan,
            atau tantangan?) dan kami akan cocokkan dengan keistimewaan setiap tempat (apakah pemandangannya, wahananya, atau ceritanya).
            <br />
            <br />
            Mari jelajahi dan banggakan Lamongan bersama Lamongan Trip!
          </p>
        </div>
      </section>
      {/* Kategori */}
      <section className="kategori-section">
        <div className="tempat-menarik-header">
          <h2>Ragam Pesona Lamongan</h2>
          <p className="tempat-menarik-subtitle">Dari ketenangan wisata religi hingga serunya petualangan bahari, temukan kategori wisata di Lamongan yang paling sesuai untuk Anda. Rencanakan perjalanan tak terlupakan di Kota Soto!</p>
        </div>{" "}
        <div className="tempat-menarik-grid">
          {/* Card kecil */}
          <div
            className="place-card"
            onClick={() => (window.location.href = `/destination/religi`)}>
            <img
              src={religi}
              alt="Wisata Religi"
              className="place-image"
            />
            <div className="place-info">
              <h3>Wisata Religi</h3>
            </div>
          </div>
          <div
            className="place-card"
            onClick={() => (window.location.href = `/destination/alam`)}>
            <img
              src={alami}
              alt="Wisata Alam"
              className="place-image"
            />
            <div className="place-info">
              <h3>Wisata Alam</h3>
            </div>
          </div>
          <div
            className="place-card"
            onClick={() => (window.location.href = `/destination/buatan`)}>
            <img
              src={buatan}
              alt="Wisata Buatan"
              className="place-image"
            />
            <div className="place-info">
              <h3>Wisata Buatan</h3>
            </div>
          </div>
        </div>
        <div className="see-all-link-container">
          <a
            href="/destination"
            className="see-all-link">
            Lihat Semua Destinasi
          </a>
        </div>
      </section>
      {/* Artikel Terbaru */}
      <section className="artikel-section">
        <div className="artikel-header-container">
          <div className="artikel-header-text">
            <h5>Artikel</h5>
            <h2>Lihat apa yang sedang terjadi di Lamongan saat ini.</h2>
            <p>Lamongan, kota wisata dengan beragam pesona, menawarkan keragaman pengalaman yang tidak akan pernah Anda lupakan. Apa saja berita dan informasi terbaru tentang Lamongan?</p>{" "}
            <Link
              to="/articles"
              className="artikel-view-all-btn">
              Lihat semua Berita & Pembaruan <ArrowRightOutlined />
            </Link>
          </div>
        </div>

        <div className="artikel-cards-container">
          {!isLoading && !error && data && data.length > 0 ? (
            data.slice(0, 2).map((item) => (
              <div
                className="artikel-card-large"
                key={item.id_artikel}
                onClick={() => (window.location.href = `/article/${item.id_artikel}`)}>
                <div
                  className="artikel-card-image"
                  style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL + item.gambar})` }}>
                  <div className="artikel-date">{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }).replace(" ", " ")}</div>
                </div>
                <div className="artikel-card-content">
                  <h3>{item.judul}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="no-articles">{isLoading ? "Loading..." : "Tidak ada artikel terbaru."}</div>
          )}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePages;
