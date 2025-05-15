import styles from "./AccountSetting.module.css";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";

function AccountSetting() {
  const { user, logout } = useAuth();
    
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

      </div>
    </div>
  )
}

export default AccountSetting