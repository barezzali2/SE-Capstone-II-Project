import styles from "./AccountSetting.module.css";
import Sidebar from "./Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../contexts/AdminContext";

const API_URL = import.meta.env.PROD
  ? "https://retailxplorebackend.onrender.com/admin"
  : "http://localhost:3003/admin";

function AccountSetting() {
  const { user, updateUser, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { authAxios } = useAdmin();

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const response = await axios.put(
        `${API_URL}/account`,
        { name: form.name, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.user) {
        updateUser(response.data.user);
        await fetchUser();
        setMsg("Account updated successfully");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update account");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await authAxios.post(`${API_URL}/change-password`, {
        currentPassword: form.password,
        newPassword: form.newPassword,
        token,
      });

      setMsg("Password updated successfully");
      setError("");
      setForm({ ...form, password: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
      setMsg("");
    }
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Account Setting</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
          </div>
        </div>
        <div className={styles.formContainer}>
          <h2>Update Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={user?.name || "Enter your name"}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={form.email}
                type="email"
                onChange={handleChange}
                placeholder={user?.email || "Enter your email"}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Update
            </button>
            {msg && <div className={styles.successMessage}>{msg}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
          <div className={styles.changePassword}>
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Current Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="Enter your new password again"
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
