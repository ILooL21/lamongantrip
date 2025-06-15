import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined } from "@ant-design/icons";
import { useGetAllUsersQuery, useDeleteUserDataMutation } from "../../slices/userApiSlice";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import UserModal from "../../components/admin/users/UserModal";
import Swal from "sweetalert2";
import "../../styles/UserManagement.css";
import Search from "antd/es/input/Search";

const UserManagementPages = () => {
  const [listUsers, setListUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategories, setSearchCategories] = useState("username");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add', 'edit', 'detail'
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: userData, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserDataMutation();

  useEffect(() => {
    if (!isLoading && userData) {
      setListUsers(userData);
    }
  }, [userData, isLoading]);

  // Fungsi untuk membuka modal
  const openModal = (type, userId = null) => {
    setModalType(type);
    setSelectedUserId(userId);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedUserId(null);
  };

  // Fungsi untuk merender tabel berdasarkan pencarian
  const renderRowTable = () => {
    return listUsers
      .filter((user) => user[searchCategories].toLowerCase().includes(searchTerm.toLowerCase()))
      .map((user, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            {user.is_active_user ? (
              <a title="Tidak Bisa Mengatur, Ubah di Menu Profile">
                <LockOutlined style={{ color: "red" }} />
              </a>
            ) : (
              <>
                <button
                  className="btn btn-info"
                  onClick={() => openModal("detail", user.id_user)}
                  title="Detail">
                  <EyeOutlined />
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => openModal("edit", user.id_user)}
                  title="Edit">
                  <EditOutlined />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id_user)}
                  title="Delete">
                  <DeleteOutlined />
                </button>
              </>
            )}
          </td>
        </tr>
      ));
  };

  const handleDeleteUser = async (id) => {
    let id_user = parseInt(id);

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
          const res = await deleteUser({ id: id_user }).unwrap();

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
        <Sidebar activeMenu={"users"} />
        <div className="container-dashboard">
          <div className="container-dashboard-header">
            <Breadcrumb
              className="breadcrumb-dashboard"
              items={[{ title: <a href="/admin/dashboard">Home</a> }, { title: "Pengguna" }]}
            />
          </div>
          <div className="container-dashboard-body">
            <h1>Table Data Pengguna</h1>
            <div style={{ display: "flex", marginBottom: "20px", justifyContent: "space-between" }}>
              <button
                className="btn btn-primary"
                onClick={() => openModal("add")}>
                Tambah Pengguna
              </button>
              <div className="search-bar">
                <select
                  id="search"
                  className="form-control search-bar-select"
                  onChange={(e) => setSearchCategories(e.target.value)}>
                  <option value="username">Username</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                </select>
                <Search
                  placeholder="Cari User"
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
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
                        Tidak ada data pengguna.
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
        <UserModal
          isDetailModal={modalType === "detail"}
          isEditModal={modalType === "edit"}
          isAddModal={modalType === "add"}
          id_user={selectedUserId}
          onClose={closeModal}
        />
      )}
    </>
    
  );
};

export default UserManagementPages;
