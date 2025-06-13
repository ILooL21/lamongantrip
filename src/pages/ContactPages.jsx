import { useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { FacebookFilled, InstagramOutlined, MailOutlined, PhoneOutlined, XOutlined } from "@ant-design/icons";
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
      <div className="container-contact">
        <div className="container-menu-form-contact">
          <div className="menu-contact">
            <div className="menu-contact-header">
              <a>
                <PhoneOutlined className="icon-phone" />
              </a>
              <h2>Hubungi Kami</h2>
            </div>
            <div className="menu-contact-content">
              <p>Kami selalu sedia dalam 24 jam setiap hari</p>
              <p>Phone: +62 857-4582-0511</p>
              <p>Email: lamongantrip@gmail.com</p>
            </div>
            <hr />
            <div className="menu-contact-header">
              <a>
                <MailOutlined className="icon-mail" />
              </a>
              <h2>Tetap terhubung dengan kami</h2>
            </div>
            <div className="menu-contact-content">
              <p>Ikuti Sosial Media kami untuk bertanya dan mendapatkan informasi terbaru</p>
              <a
                href="https://www.instagram.com/mkrilul/"
                target="_blank">
                <p>
                  <InstagramOutlined /> Lamongan Trip
                </p>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100009379517600"
                target="_blank">
                <p>
                  <FacebookFilled /> Lamongan Trip
                </p>
              </a>
              <a
                href="https://x.com/DeusExMachine69"
                target="_blank">
                <p>
                  <XOutlined /> Lamongan Trip
                </p>
              </a>
            </div>
          </div>

          <form
            className="container-form-contact"
            onSubmit={submitHandler}>
            <div className="container-form-contact-up">
              <div className="form-contact">
                <div className="menu-contact-header">
                  <h2>Kirim Email</h2>
                </div>
                <div className="menu-contact-content">
                  <p>Berikan kami email jika ada pertanyaan, kritik, atau saran. Kami akan membalas melalui email paling lambat 1 x 24 jam</p>
                </div>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  name="email"
                  pattern="[^ @]*@[^ @]*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-contact-input"
                />
              </div>
              <div className="form-contact">
                <input
                  type="text"
                  placeholder="Masukkan Subjek"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-contact-input"
                />
              </div>
            </div>

            <div className="form-contact">
              <textarea
                name="message"
                id="message"
                cols="30"
                rows="10"
                className="form-contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Masukkan Pesan"></textarea>
            </div>
            <div className="container-button-contact">
              <button
                type="submit"
                disabled={email === "" || subject === "" || message === "" || isLoading}
                className="button-contact-save">
                {isLoading ? <Loading /> : "Kirim Pesan"}
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
