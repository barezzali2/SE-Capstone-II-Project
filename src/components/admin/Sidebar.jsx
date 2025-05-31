import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { FiGrid, FiPackage, FiPercent, FiStar, FiMap, FiSettings } from "react-icons/fi";
import Logo from "../Logo";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Logo />
        <h2 className={styles.dashboardTitle}>Admin Panel</h2>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <FiGrid className={styles.icon} />
          <span>Statistics</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <FiPackage className={styles.icon} />
          <span>Product Management</span>
        </NavLink>

        <NavLink
          to="/admin/discounts"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <FiPercent className={styles.icon} />
          <span>Discount Management</span>
        </NavLink>

        <NavLink
          to="/admin/featured"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <FiStar className={styles.icon} />
          <span>Featured Management</span>
        </NavLink>

        <NavLink 
        to="/admin/storeMap"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        >
          <FiMap className={styles.icon} />
          <span>Store Map Management</span>
        </NavLink>

        <NavLink 
        to="/admin/accSetting"
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
        >
          <FiSettings className={styles.icon} />
          <span>Account Setting</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
