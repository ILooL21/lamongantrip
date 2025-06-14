import { useEffect, useState } from "react";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetActiveUserDataQuery, useUpdateUserDataMutation } from "../slices/userApiSlice";
import Loading from "../components/Loading";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import "../styles/Profile.css";
import Swal from "sweetalert2";
import InstallButton from "../components/InstallButton";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";

const ProfilePages = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, error, isLoading } = useGetActiveUserDataQuery();
  const [updateUserData, { isLoading: isUpdateLoading }] = useUpdateUserDataMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Function untuk update profile (gabungan data pribadi dan password)
  const updateProfile = async (e) => {
    e.preventDefault();

    // Validasi data pribadi
    if (!username || !email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username dan Email tidak boleh kosong",
      });
      return;
    }

    // Validasi password jika diisi
    if (oldPassword || password || confirmPassword) {
      if (!oldPassword || !password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Jika ingin mengubah password, password lama dan password baru harus diisi",
        });
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Konfirmasi password tidak sesuai",
        });
        return;
      }
    }

    try {
      const updateData = {
        id: data.id_user,
        username: username,
        email: email,
        role: data.role,
        oldPassword: oldPassword,
        password: password,
      };

      // Tambahkan password hanya jika diisi
      if (oldPassword && password) {
        updateData.password = password;
        updateData.oldPassword = oldPassword;
      }

      const res = await updateUserData(updateData).unwrap();

      if (res.detail) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.detail,
        });
      } else {
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Profil berhasil diperbarui",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.detail || "Gagal update profil",
      });
    }
  };

  useEffect(() => {
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Anda telah logout! Silahkan login kembali",
      });
      dispatch(logout());
      navigate("/auth");
    }
  }, [data, error, dispatch, navigate]);
  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Header />
      <InstallButton />
      <div className="profile-container-modern">
        <div className="profile-header">
          <h1 className="profile-title">
            <UserOutlined className="profile-icon" />
            Pengaturan Profil
          </h1>
          <p className="profile-subtitle">Kelola informasi pribadi dan keamanan akun Anda</p>
        </div>{" "}
        <form
          onSubmit={updateProfile}
          className="profile-unified-form">
          <div className="profile-cards-container">
            {/* Card Data Pribadi */}
            <div className="profile-card">
              <div className="card-header">
                <UserOutlined className="card-icon" />
                <div>
                  <h2 className="card-title">Data Pribadi</h2>
                  <p className="card-description">Perbarui informasi dasar akun Anda</p>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-group-modern">
                  <label className="form-label-modern">Username</label>
                  <div className="input-wrapper-modern">
                    <UserOutlined className="input-icon" />
                    <input
                      type="text"
                      value={username}
                      name="username"
                      placeholder="Masukkan Username"
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input-modern"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-modern">
                  <label className="form-label-modern">Email</label>
                  <div className="input-wrapper-modern">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      placeholder="Masukkan Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      className="form-input-modern"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Password */}
            <div className="profile-card">
              <div className="card-header">
                <LockOutlined className="card-icon" />
                <div>
                  <h2 className="card-title">Keamanan</h2>
                  <p className="card-description">Ubah password untuk menjaga keamanan akun (opsional)</p>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-group-modern">
                  <label className="form-label-modern">Password Lama</label>
                  <div className="input-wrapper-modern">
                    <LockOutlined className="input-icon" />
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Password Lama"
                      name="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="form-input-modern"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="password-toggle">
                      {showOldPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                </div>

                <div className="form-group-modern">
                  <label className="form-label-modern">Password Baru</label>
                  <div className="input-wrapper-modern">
                    <LockOutlined className="input-icon" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Password Baru"
                      name="newPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input-modern"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="password-toggle">
                      {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                </div>

                <div className="form-group-modern">
                  <label className="form-label-modern">Konfirmasi Password Baru</label>
                  <div className="input-wrapper-modern">
                    <LockOutlined className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input-modern"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle">
                      {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                </div>

                <div className="password-info">
                  <small className="form-helper-text">💡 Kosongkan jika tidak ingin mengubah password. Password harus minimal 6 karakter</small>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdateLoading}
            className="btn-primary-modern btn-submit-unified">
            {isUpdateLoading ? <Loading /> : "Simpan Semua Perubahan"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilePages;
