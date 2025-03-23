import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useGetUserDataMutation, useRegisterMutation, useUpdateUserDataMutation } from "../../../slices/userApiSlice";
import { Button, Modal } from "antd";
import "../../../styles/UserModal.css";
import { Radio } from "antd";
import Swal from "sweetalert2";

const UserModal = ({ isDetailModal, isEditModal, isAddModal, id_user, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [getUserData] = useGetUserDataMutation();
  const [updateUserData] = useUpdateUserDataMutation();
  const [createUserData] = useRegisterMutation();

  // Fetch data jika modal detail atau edit dibuka
  useEffect(() => {
    showModal();
    if ((isDetailModal || isEditModal) && id_user) {
      const fetchData = async () => {
        try {
          await getUserData({ id: id_user })
            .unwrap()
            .then((res) => {
              setFormData({
                username: res.username || "",
                email: res.email || "",
                role: res.role || "",
                password: "",
              });
              setLoading(false);
            });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }
    if (isAddModal) {
      setLoading(false);
    }
  }, [getUserData, isDetailModal, isEditModal, isAddModal, id_user]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose(); // Memberi tahu induk bahwa modal ditutup
  };

  const options = [
    {
      label: "User",
      value: "user",
    },
    {
      label: "Admin",
      value: "admin",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Menggunakan name, bukan id
    }));
  };

  const createUserHandler = () => {
    try {
      createUserData(formData)
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pengguna berhasil ditambahkan",
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.reload();
            }
          });
        });
    } catch (error) {
      console.error("Error creating user data:", error);
    }
  };

  const updateUserHandler = async () => {
    try {
      await updateUserData({ ...formData, id: id_user })
        .unwrap()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data pengguna berhasil diupdate",
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.reload();
            }
          });
        });
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <Modal
        title={isAddModal ? "Tambah Pengguna" : isEditModal ? "Edit Pengguna" : "Detail Pengguna"}
        open={isModalOpen}
        onCancel={handleCancel}
        loading={loading}
        footer={[
          isAddModal ? (
            <Button
              key="submit"
              type="primary"
              onClick={createUserHandler}>
              Tambah
            </Button>
          ) : isEditModal ? (
            <Button
              key="submit"
              type="primary"
              onClick={updateUserHandler}>
              Simpan
            </Button>
          ) : null,
          <Button
            key="close"
            onClick={handleCancel}>
            Tutup
          </Button>,
        ]}>
        <form className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange={handleChange}
              value={formData.username}
              disabled={isDetailModal}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              onChange={handleChange}
              defaultValue={isDetailModal || isEditModal ? formData.email : ""}
              disabled={isDetailModal}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            {isDetailModal ? (
              <p>{formData.role}</p>
            ) : (
              <Radio.Group
                options={options}
                onChange={handleChange}
                value={formData.role}
                name="role"
              />
            )}
          </div>
          {isDetailModal ? null : (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={handleChange}
                disabled={isDetailModal}
              />
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};

UserModal.propTypes = {
  isDetailModal: PropTypes.bool,
  isEditModal: PropTypes.bool,
  isAddModal: PropTypes.bool,
  id_user: PropTypes.number,
  onClose: PropTypes.func,
};

export default UserModal;
