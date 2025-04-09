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

const ProfilePages = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const { data, error, isLoading } = useGetActiveUserDataQuery();
  const [updateUserData, { isLoading: isUpdateLoading }] = useUpdateUserDataMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserData({
        id: data.id_user,
        username: username,
        email: email,
        password: password,
        oldPassword: oldPassword,
        role: data.role,
      }).unwrap();

      if (res.detail) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.detail,
        });
      } else {
        setOldPassword("");
        setPassword("");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Profile berhasil diupdate",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.detail || "Gagal update profile",
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
      <div>
        <form
          onSubmit={updateProfile}
          className="form-profile-update">
          <h1>Edit Profile</h1>
          <input
            type="text"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder={email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <input
            type="password"
            placeholder="Password Lama"
            name="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <small>*Kosongkan jika tidak ingin mengganti password</small>
          <input
            type="password"
            placeholder="Password Baru"
            name="newpassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small>*Kosongkan jika tidak ingin mengganti password</small>
          <button
            id="btn-update-profile"
            disabled={isUpdateLoading}
            onClick={updateProfile}
            type="submit">
            {isUpdateLoading ? <Loading /> : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilePages;
