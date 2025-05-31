import { useState } from "react";
import axios from "axios";
import styles from "../../components/admin/LoginForm.module.css";
import loginStyles from "./Login.module.css";

const API_URL = import.meta.env.PROD
  ? "https://retailxplorebackend.onrender.com/admin"
  : "http://localhost:3003/admin";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      if (!email || !newPassword) {
        throw new Error("Email and new password are required");
      }
      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      await axios.put(`${API_URL}/password`, {
        email,
        newPassword,
      });
      setMsg(
        "Password reset successfully. You can now login with your new password."
      );
      setEmail("");
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 style={{ marginBottom: "2rem" }}>Reset Admin Password</h2>
        <form onSubmit={handleReset} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className={styles.input}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {msg && <div className={styles.successMessage}>{msg}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
