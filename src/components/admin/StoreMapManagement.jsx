import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import styles from "./StoreMapManagement.module.css";

function StoreMapManagement() {
      const { user, logout } = useAuth();
    
  return (
     <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Store Map Management</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
        </div>
    
        </div>

      </div>
    </div>
  )
}

export default StoreMapManagement;