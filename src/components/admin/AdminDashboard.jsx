import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import Sidebar from "./Sidebar";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { products } = useProduct();

  const handleLogout = () => {
    logout();
  };

  // these will be handled by backend later
  const totalProducts = products.length;
  const mostAddedProduct = products[0]?.name || "N/A";
  const highestRatedProduct = "Product X";

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Most Added to Cart</h3>
            <p>{mostAddedProduct}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Highest Rated</h3>
            <p>{highestRatedProduct}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
