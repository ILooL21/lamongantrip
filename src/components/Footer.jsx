import { EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookFilled, InstagramOutlined, XOutlined, CompassOutlined, HeartOutlined, StarOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-modern">
      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section company-info">
          <div className="footer-logo">
            <div className="footer-logo-text">
              <h3 className="footer-brand">Lamongan Trip</h3>
              <p className="footer-tagline">Jelajahi Keindahan Lamongan</p>
            </div>
          </div>
          <p className="footer-description">
            Platform terpercaya untuk menemukan destinasi wisata terbaik di Lamongan. Kami membantu Anda merencanakan perjalanan yang tak terlupakan dengan rekomendasi tempat wisata, kuliner, dan pengalaman autentik.
          </p>
          <div className="footer-badges">
            <div className="badge">
              <SafetyCertificateOutlined className="badge-icon" />
              <span>Terpercaya</span>
            </div>
            <div className="badge">
              <StarOutlined className="badge-icon" />
              <span>Berpengalaman</span>
            </div>
            <div className="badge">
              <HeartOutlined className="badge-icon" />
              <span>Ramah Wisatawan</span>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section quick-links">
          <h4 className="footer-title">
            <CompassOutlined className="footer-icon" />
            Jelajahi Wisata
          </h4>
          <ul className="footer-links">
            <li>
              <Link to="/rekomendasi-wisata">Rekomendasi Wisata</Link>
            </li>
            <li>
              <Link to="/destination/alam">Wisata Alam</Link>
            </li>
            <li>
              <Link to="/destination/buatan">Wisata Buatan</Link>
            </li>
            <li>
              <Link to="/destination/religi">Wisata Religi</Link>
            </li>
            <li>
              <Link to="/articles">Artikel & Tips</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="footer-section contact-info">
          <h4 className="footer-title">
            <PhoneOutlined className="footer-icon" />
            Hubungi Kami
          </h4>
          <div className="contact-items">
            <div className="contact-item">
              <EnvironmentOutlined className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Lokasi</span>
                <span className="contact-value">Lamongan, Jawa Timur</span>
              </div>
            </div>
            <div className="contact-item">
              <PhoneOutlined className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Telepon</span>
                <a
                  href="tel:+6285745820511"
                  className="contact-value">
                  +62 857-4582-0511
                </a>
              </div>
            </div>
            <div className="contact-item">
              <MailOutlined className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <a
                  href="mailto:lamongantrip@gmail.com"
                  className="contact-value">
                  lamongantrip@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-section">
          <h4 className="footer-title">
            <HeartOutlined className="footer-icon" />
            Ikuti Kami
          </h4>{" "}
          <p className="social-description">Dapatkan update destinasi terbaru</p>
          <div className="social-links-compact">
            <a
              href="https://www.instagram.com/mkrilul/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-compact instagram"
              aria-label="Follow us on Instagram">
              <InstagramOutlined className="social-icon-compact" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100009379517600"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-compact facebook"
              aria-label="Follow us on Facebook">
              <FacebookFilled className="social-icon-compact" />
            </a>
            <a
              href="https://x.com/DeusExMachine69"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-compact twitter"
              aria-label="Follow us on Twitter">
              <XOutlined className="social-icon-compact" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>
              &copy; {currentYear} <strong>Lamongan Trip</strong>. Semua hak cipta dilindungi.
            </p>
            <p className="creator">
              Dibuat dengan <HeartOutlined className="heart-icon" /> oleh{" "}
              <a
                href="https://www.linkedin.com/in/muhamad-kholilur-rohman-3450371a2/"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link">
                Muhamad Kholilur Rohman
              </a>
            </p>
          </div>
          <div className="footer-links-bottom">
            <Link
              to="/contact-us"
              className="footer-link-bottom">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
