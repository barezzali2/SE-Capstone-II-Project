import styles from "./AccountSetting.module.css";
import Sidebar from "./Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const API_URL = import.meta.env.PROD ? "https://retailxplorebackend.onrender.com/admin" : "http://localhost:3003/admin";


function AccountSetting() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

    
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
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                
                placeholder="Enter your name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={form.email}
                type="email"
               
                placeholder="Enter your email"
              />
            </div>


            <div className={styles.changePassword}>

            <h3>Change Password</h3>
              

             <div className={styles.formGroup}>
              <label htmlFor="password">Current Password</label>
              <div className={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} // Allow user to input current password
                type={showPassword ? "text" : "password"} // Toggle input type
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
                  
                  type={showNewPassword ? "text" : "password"} // Toggle input type
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
          </div>

            
            <button type="submit" className={styles.submitButton}>
              Update
            </button>
            {msg && <div className={styles.successMessage}>{msg}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>


      </div>
    </div>
  )
}

export default AccountSetting