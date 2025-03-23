import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import MailModal from "../../components/admin/mails/MailModal";
import Swal from "sweetalert2";
import { useDeleteMailMutation, useGetAllMailQuery } from "../../slices/contactApiSlice";
import "../../styles/MailManagement.css";

const MailManagementPages = () => {
  const [listMails, setListMails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategories, setSearchCategories] = useState("email");
  const [showModal, setShowModal] = useState(false);
  const [selectedMailData, setSelectedMailData] = useState({
    id: "",
    email: "",
    subject: "",
    message: "",
  });

  const { data: mailData, isLoading } = useGetAllMailQuery();
  const [deleteMail] = useDeleteMailMutation();

  useEffect(() => {
    if (!isLoading && mailData) {
      setListMails(mailData);
    }
  }, [mailData, isLoading]);

  // Fungsi untuk membuka modal
  const openModal = (mailId) => {
    setSelectedMailData({
      id: mailId,
      email: listMails.find((mail) => mail.id === mailId).email,
      subject: listMails.find((mail) => mail.id === mailId).subject,
      message: listMails.find((mail) => mail.id === mailId).message,
    });
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedMailData({
      id: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  // Fungsi untuk merender tabel berdasarkan pencarian
  const renderRowTable = () => {
    return listMails
      .filter((mail) => mail[searchCategories].toLowerCase().includes(searchTerm.toLowerCase()))
      .map((mail, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{mail.email}</td>
          <td>{mail.subject}</td>
          <td>{mail.message}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => openModal(mail.id)}>
              <SendOutlined />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteMail(mail.id)}>
              <DeleteOutlined />
            </button>
          </td>
        </tr>
      ));
  };

  const handleDeleteMail = async (id) => {
    let mailId = parseInt(id);

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pengguna akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteMail({ id: mailId }).unwrap();

          if (res) {
            Swal.fire("Berhasil", "Pengguna berhasil dihapus", "success").then(() => {
              window.location.reload();
            });
          }
        } catch (e) {
          Swal.fire("Gagal", e, "error");
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div
        className="wrapper-body"
        style={{ display: "flex" }}>
        <Sidebar activeMenu={"mails"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[{ title: <a href="/admin/dashboard">Home</a> }, { title: "Pengguna" }]}
            />
          </div>
          <div className="container-dashboard-body">
            <h1>Table Data Email</h1>
            <div style={{ display: "flex", marginBottom: "20px", justifyContent: "end" }}>
              <div className="search-bar">
                <select
                  id="search"
                  className="form-control search-bar-select"
                  onChange={(e) => setSearchCategories(e.target.value)}>
                  <option value="email">Email</option>
                  <option value="subject">Subject</option>
                  <option value="message">Message</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari Email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center" }}>
                        Loading...
                      </td>
                    </tr>
                  ) : renderRowTable().length > 0 ? (
                    renderRowTable()
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center" }}>
                        Tidak ada data mail.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MailModal
          selectedMailData={selectedMailData}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default MailManagementPages;
