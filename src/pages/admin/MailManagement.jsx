import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import Swal from "sweetalert2";
import { useDeleteMailMutation, useGetAllMailQuery } from "../../slices/contactApiSlice";
import "../../styles/MailManagement.css";
import Search from "antd/es/input/Search";

const MailManagementPages = () => {
  const [listMails, setListMails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategories, setSearchCategories] = useState("email");

  const { data: mailData, isLoading } = useGetAllMailQuery();
  const [deleteMail] = useDeleteMailMutation();

  useEffect(() => {
    if (!isLoading && mailData) {
      setListMails(mailData);
    }
  }, [mailData, isLoading]);

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
            {/* Tombol Balas ke email pengirim */}
            <a
              href={`mailto:${mail.email}?subject=${encodeURIComponent("Balasan dari Admin Lamongan Trip")}&body=${encodeURIComponent(`Mail Anda\n\n${mail.message}\n\n [Balasan]`)}`}
              target="_blank"
              rel="noopener noreferrer">
              <button className="btn btn-primary">Balas</button>
            </a>

            {/* Tombol hapus */}
            <button
              className="btn btn-info"
              onClick={() => handleDeleteMail(mail.id)}>
              Selesai
            </button>
          </td>
        </tr>
      ));
  };

  const handleDeleteMail = async (id) => {
    let mailId = parseInt(id);

    Swal.fire({
      title: "Apakah Mail Sudah Dibalas?",
      text: "Mail yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesai!",
      cancelButtonText: "Batalkan",
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
              items={[{ title: <a href="/admin/dashboard">Home</a> }, { title: "Mail" }]}
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
                <Search
                  placeholder="Cari Mail"
                  value={searchTerm}
                  allowClear
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
    </>
  );
};

export default MailManagementPages;
