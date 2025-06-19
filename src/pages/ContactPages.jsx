import { useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { FacebookFilled, InstagramOutlined, MailOutlined, PhoneOutlined, XOutlined, EnvironmentOutlined, CustomerServiceOutlined, SendOutlined, HeartOutlined } from "@ant-design/icons";
import { useCreateContactMutation } from "../slices/contactApiSlice";
import "../styles/Contact.css";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";

const ContactPages = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [createContact, { isLoading }] = useCreateContactMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createContact({
        email: email,
        subject: subject,
        message: message,
      }).unwrap();

      if (res.detail) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.detail,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pesan berhasil terkirim, Kami akan membalas melalui email paling lambat 1 x 24 jam",
        });
      }
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Header />
      <InstallButton />

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">
            <CustomerServiceOutlined className="hero-icon" />
            Hubungi Kami
          </h1>
          <p className="contact-hero-subtitle">Tim Lamongan Trip siap membantu Anda merencanakan petualangan wisata yang tak terlupakan</p>
        </div>
      </div>

      <div className="contact-container-modern">
        {/* Contact Info Cards */}
        <div className="contact-info-section">
          <h2 className="section-title">
            <HeartOutlined className="section-icon" />
            Mari Terhubung dengan Kami
          </h2>

          <div className="contact-cards-grid">
            {/* Phone Card */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <PhoneOutlined />
              </div>
              <h3 className="contact-card-title">Telepon</h3>
              <p className="contact-card-desc">Siap melayani 24/7 untuk konsultasi wisata</p>
              <a
                href="tel:+6285745820511"
                className="contact-card-link">
                +62 857-4582-0511
              </a>
            </div>

            {/* Email Card */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <MailOutlined />
              </div>
              <h3 className="contact-card-title">Email</h3>
              <p className="contact-card-desc">Kirim pertanyaan atau permintaan khusus</p>
              <a
                href="mailto:lamongantrip@gmail.com"
                className="contact-card-link">
                lamongantrip@gmail.com
              </a>
            </div>

            {/* Location Card */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <EnvironmentOutlined />
              </div>
              <h3 className="contact-card-title">Lokasi</h3>
              <p className="contact-card-desc">Kunjungi kantor kami di jantung Lamongan</p>
              <span className="contact-card-link">Lamongan, Jawa Timur</span>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-media-section">
          <h2 className="section-title">
            <SendOutlined className="section-icon" />
            Ikuti Media Sosial Pengembang
          </h2>
          <p className="section-desc">Sampaikan pesan, kritik, atau saran melalui media sosial kami. Agar kami dapat meningkatkan layanan website kami.</p>

          <div className="social-links-grid">
            <a
              href="https://www.instagram.com/mkrilul/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram">
              <InstagramOutlined className="social-icon" />
              <div className="social-content">
                <h4>Instagram</h4>
                <span>@mkrilul</span>
              </div>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100009379517600"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link facebook">
              <FacebookFilled className="social-icon" />
              <div className="social-content">
                <h4>Facebook</h4>
                <span>Muhammad Kholilur Rohman</span>
              </div>
            </a>

            <a
              href="https://x.com/DeusExMachine69"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter">
              <XOutlined className="social-icon" />
              <div className="social-content">
                <h4>Twitter</h4>
                <span>@DeusExMachine69</span>
              </div>
            </a>
          </div>
        </div>

        {/* Feedback Form Section */}
        <div className="feedback-section">
          <div className="feedback-header">
            <h2 className="section-title">
              <MailOutlined className="section-icon" />
              Kritik & Saran
            </h2>
            <p className="section-desc">Bantuan Anda sangat berarti untuk meningkatkan layanan wisata kami</p>
          </div>

          <form
            className="feedback-form"
            onSubmit={submitHandler}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Anda</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Masukkan alamat email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subjek</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Topik atau kategori pesan"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pesan Anda</label>
              <textarea
                name="message"
                rows="6"
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan pengalaman, saran, atau kritik Anda"
                required></textarea>
            </div>

            <div className="form-submit">
              <button
                type="submit"
                disabled={email === "" || subject === "" || message === "" || isLoading}
                className="submit-btn">
                {isLoading ? (
                  <Loading />
                ) : (
                  <>
                    <SendOutlined className="btn-icon" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};
export default ContactPages;
