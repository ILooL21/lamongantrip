import Header from "../components/Header";
import "../styles/HomePages.css";
import { Link } from "react-router-dom";
import { FacebookFilled, InstagramOutlined, LinkedinFilled, YoutubeFilled } from "@ant-design/icons";
import { useGetLatestArticleQuery } from "../slices/articleApiSlice";
import img from "../assets/tugu.jpeg";
import pasfoto from "../assets/pasfoto.jpg";
import alami from "../assets/alam.jpeg";
import religi from "../assets/religi.webp";
import buatan from "../assets/buatan.webp";
import InstallButton from "../components/InstallButton";

const HomePages = () => {
  const { data, error, isLoading } = useGetLatestArticleQuery();

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Ayo Jelajahi Keindahan Lamongan!</h2>
          <p>Liburan di Lamongan? Kenapa nggak! Mulai dari wisata alam yang menyegarkan hingga spot unik yang Instagramable, semua ada di sini. Yuk, rencanakan petualanganmu dan temukan tempat-tempat seru di Lamongan!</p>

          <a
            href="/rekomendasi-wisata"
            className="btn-selengkapnya">
            Dapatkan Rekomendasi
          </a>
        </div>

        <div className="hero-image">
          <img
            src={img}
            alt="Destination"
          />
        </div>
      </section>

      <InstallButton />

      {/* Tentang Website */}
      <section className="tentang-section">
        <h2>Tentang Website Ini</h2>
        <p>
          Website ini merupakan platform rekomendasi destinasi wisata di Lamongan yang menggunakan teknologi <strong>machine learning</strong>. Rekomendasi diberikan berdasarkan dua hal utama:{" "}
          <strong>alasan seseorang ingin berwisata</strong> (seperti ingin relaksasi, mencari hiburan, atau petualangan), dan <strong>daya tarik dari tempat wisatanya sendiri</strong> (seperti pemandangan alam, wahana unik, atau nilai
          sejarah). Selain itu, website ini juga menyajikan informasi lengkap mengenai tempat wisata, harga tiket, lokasi, dan artikel menarik seputar wisata di Lamongan.
        </p>
      </section>

      {/* Kategori */}
      <section className="kategori-section">
        <div
          className="kategori-content"
          style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Keterangan di sebelah kiri */}
          <div
            className="kategori-description"
            style={{ flex: "1 1 300px" }}>
            <h2>Ada Apa di Lamongan?</h2>
            <p>
              Sedang cari inspirasi liburan? Temukan keindahan wisata alam, ketenangan destinasi religi, keseruan wahana buatan, kekayaan budaya, hingga cita rasa kuliner khas Lamongan. Yuk, cari tahu tempat wisata menarik di Lamongan dan
              rencanakan liburan serumu sekarang!
            </p>
          </div>

          {/* Kategori dan link */}
          <div
            className="kategori-right"
            style={{ flex: "2 1 500px" }}>
            <div
              className="kategori-header"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Kategori Wisata</h2>
              <a
                href="/destination"
                className="lihat-semua-link">
                Lihat Semua
              </a>
            </div>

            <div
              className="kategori-wrapper"
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {["Alam", "Religi", "Buatan"].map((kategori) => (
                <div
                  className="kategori-card"
                  key={kategori}
                  onClick={() => (window.location.href = `/destination/${kategori.toLowerCase()}`)}>
                  <img
                    src={kategori === "Alam" ? alami : kategori === "Religi" ? religi : buatan}
                    alt={`Wisata ${kategori}`}
                    className="kategori-image"
                  />
                  <p className="kategori-label">Wisata {kategori}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="artikel-section">
        <div className="artikel-header">
          <h2>Artikel Terbaru</h2>
          <Link
            to="/artikel"
            className="lihat-semua-link">
            Lihat Semua
          </Link>
        </div>

        <div className="artikel-grid">
          {!isLoading && !error && data.length > 0 ? (
            data.map((item) => (
              <div
                className="artikel-card"
                key={item.id_artikel}
                onClick={() => (window.location.href = `/article/${item.id_artikel}`)}>
                <img
                  src={import.meta.env.VITE_API_URL + item.gambar}
                  alt={`Artikel ${item.judul}`}
                  className="artikel-image"
                />
                <h3>{item.judul}</h3>
                <p>{item.isi.slice(0, 100)}...</p>
              </div>
            ))
          ) : (
            <div className="no-articles">{isLoading ? "Loading..." : "Tidak ada artikel terbaru."}</div>
          )}
        </div>
      </section>

      {/* Greet the Developer */}
      <section className="greet-section">
        <h2>Greet the Developer</h2>
        <div className="developer-card">
          <img
            src={pasfoto}
            alt="Muhamad Kholilur Rohman"
            className="developer-photo"
          />
          <div className="developer-info">
            <h3>Muhamad Kholilur Rohman</h3>
            <p>
              Saya memiliki minat di bidang backend development dan analisis data. Saat ini saya sedang aktif mengembangkan keterampilan di kedua bidang tersebut, sambil terus belajar dan memahami berbagai aspek teknis yang mendukungnya.
              Saya berkomitmen untuk terus berkembang dan siap berkontribusi di dunia teknologi.
            </p>
            <div
              className="social-links"
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <a
                href="https://www.linkedin.com/in/muhamad-kholilur-rohman-3450371a2/"
                target="_blank"
                rel="noopener noreferrer">
                <LinkedinFilled style={{ fontSize: 20, color: "#0077B5" }} />
              </a>
              <a
                href="https://www.instagram.com/mkrilul/"
                target="_blank"
                rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: 20, color: "#C13584" }} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100009379517600"
                target="_blank"
                rel="noopener noreferrer">
                <FacebookFilled style={{ fontSize: 20, color: "#4267B2" }} />
              </a>
              <a
                href="https://www.youtube.com/channel/UC0mAYqa9s9gDGoJ-y0dF2LA/videos"
                target="_blank"
                rel="noopener noreferrer">
                <YoutubeFilled style={{ fontSize: 20, color: "#FF0000" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* thank you from developer */}
      {/* <section className="thank-you-section">
        <h2>Terima Kasih!</h2>
        <p>Terima kasih telah mengunjungi website ini. Semoga informasi yang tersedia dapat membantu kamu dalam merencanakan perjalanan wisata ke Lamongan dengan lebih mudah dan menyenangkan.</p>
        <p>Jika ada pertanyaan, saran, atau ingin sekadar berdiskusi, jangan ragu untuk menghubungi saya melalui media sosial yang tersedia.</p>
        <p>Selamat menjelajahi Lamongan, dan semoga liburanmu berkesan!</p>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; 2025 Website Rekomendasi Wisata Lamongan. Dibuat oleh{" "}
          <a
            href="https://www.linkedin.com/in/muhamad-kholilur-rohman-3450371a2/"
            target="_blank"
            rel="noopener noreferrer">
            Muhamad Kholilur Rohman
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default HomePages;
