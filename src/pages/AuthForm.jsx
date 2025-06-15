import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomeOutlined, EyeOutlined, EyeInvisibleOutlined, GoogleSquareFilled, UserOutlined, MailOutlined, LockOutlined, CompassOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useLoginMutation, useRegisterMutation, useLoginSocialMutation } from "../slices/userApiSlice";
import { useGetUserGoogleDataMutation } from "../slices/apiSlice";
import { setCredentials } from "../slices/authSlice";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import "../styles/Form.css";
import { useGoogleLogin } from "@react-oauth/google";

const FormAuth = () => {
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSame, setIsSame] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [loginSocial, { isLoading: isLoginSocialLoading }] = useLoginSocialMutation();
  const [getUserGoogleData, { isLoading: isGetUserGoogleDataLoading }] = useGetUserGoogleDataMutation();

  const { isLogin } = useSelector((state) => state.auth);

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (isLogin && !hasNavigated) {
      navigate("/");
      setHasNavigated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loginEmail === "" || loginPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tolong isi semua field",
      });
      return;
    }
    try {
      const res = await login({ username: loginEmail, password: loginPassword }).unwrap();
      dispatch(setCredentials(res["access_token"]));
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Login berhasil",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      setLoginEmail("");
      setLoginPassword("");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.detail || "Login gagal",
      });
    }
  };

  const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await getUserGoogleData(tokenResponse);
        if (!isGetUserGoogleDataLoading) {
          const loginRes = await loginSocial({
            username: res.data.name,
            email: res.data.email,
            role: "user",
            password: generateRandomString(16),
          }).unwrap();
          console.log(loginRes);
          if (!isLoginSocialLoading) {
            dispatch(setCredentials(loginRes["access_token"]));
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Login berhasil",
            }).then(() => {
              window.location.reload();
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  useEffect(() => {
    setIsSame(password === confirmPassword);
  }, [password, confirmPassword]);

  const registerHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password tidak sama",
      });
    } else if (password === "" || confirmPassword === "" || email === "" || username === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tolong isi semua field",
      });
    } else {
      try {
        await register({ username, email, password, role: "user" }).unwrap();
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Registrasi berhasil, silahkan login",
        }).then(() => {
          toggleForm();
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.data?.detail || "Registrasi gagal",
        });
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-overlay"></div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <CompassOutlined className="auth-icon" />
            <h1 className="auth-title">{isActive ? "Daftar Akun Baru" : "Masuk ke Akun"}</h1>
            <p className="auth-subtitle">{isActive ? "Bergabunglah dengan Lamongan Trip dan mulai petualangan Anda" : "Selamat datang kembali di Lamongan Trip"}</p>
          </div>{" "}
          {/* Form */}
          <div className={`auth-form-container ${isActive ? "register-mode" : "login-mode"}`}>
            <form
              onSubmit={isActive ? registerHandler : loginHandler}
              className="auth-form">
              {/* Username field - hanya untuk register */}
              {isActive && (
                <div className="form-group">
                  <div className="input-wrapper">
                    <UserOutlined className="input-icon" />
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              )}
              {/* Email field */}
              <div className="form-group">
                <div className="input-wrapper">
                  <MailOutlined className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={isActive ? email : loginEmail}
                    onChange={(e) => (isActive ? setEmail(e.target.value) : setLoginEmail(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              {/* Password field */}
              <div className="form-group">
                <div className="input-wrapper">
                  <LockOutlined className="input-icon" />
                  <input
                    type={isActive ? (showRegisterPassword ? "text" : "password") : showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={isActive ? password : loginPassword}
                    onChange={(e) => (isActive ? setPassword(e.target.value) : setLoginPassword(e.target.value))}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => {
                      if (isActive) {
                        setShowRegisterPassword(!showRegisterPassword);
                      } else {
                        setShowLoginPassword(!showLoginPassword);
                      }
                    }}>
                    {isActive ? showRegisterPassword ? <EyeOutlined /> : <EyeInvisibleOutlined /> : showLoginPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </button>
                </div>
              </div>
              {/* Confirm Password field - hanya untuk register */}
              {isActive && (
                <>
                  <div className="form-group">
                    <div className="input-wrapper">
                      <LockOutlined className="input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </button>
                    </div>
                  </div>

                  {/* Password match indicator */}
                  {(password !== "" || confirmPassword !== "") && (
                    <div className={`password-match ${isSame ? "match" : "no-match"}`}>
                      {isSame ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      <span>{isSame ? "Password cocok" : "Password tidak cocok"}</span>
                    </div>
                  )}
                </>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isActive ? isRegisterLoading : isLoginLoading}>
                {(isActive ? isRegisterLoading : isLoginLoading) ? (
                  <Loading />
                ) : (
                  <>
                    <CompassOutlined />
                    {isActive ? "Daftar Sekarang" : "Masuk"}
                  </>
                )}
              </button>{" "}
              {/* divider */}
              {!isActive && (
                <div className="auth-divider">
                  <span>Atau</span>
                </div>
              )}
              {/* Google Login - hanya untuk login */}
              {!isActive && (
                <button
                  type="button"
                  className="google-btn"
                  disabled={isLoginLoading || isLoginSocialLoading || isGetUserGoogleDataLoading}
                  onClick={() => loginGoogle()}>
                  <GoogleSquareFilled />
                  <span>Lanjutkan dengan Google</span>
                </button>
              )}
            </form>
          </div>
          {/* Toggle between login and register */}
          <div className="auth-toggle">
            <p>
              {isActive ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                type="button"
                className="toggle-btn"
                onClick={toggleForm}>
                {isActive ? "Masuk di sini" : "Daftar di sini"}
              </button>
            </p>
          </div>
          {/* Back to home */}
          <div className="back-home">
            <a
              href="/"
              className="home-link">
              <HomeOutlined />
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAuth;
