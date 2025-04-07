import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import Sidebar from "./Sidebar";
import styles from "./AdminDashboard.module.css";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { adminStatistics } = useProduct();

  const [totalProductsCount, setTotalProductsCount] = useState(null);
  const [mostAddedProductName, setMostAddedProductName] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);


  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoadingStats(true); // Start loading
      setStatsError(null); // Reset error state
      try {
        // Call the function from the context which handles the API request
        const statistics = await adminStatistics();

        // Extract the totalProducts value from the response and update state
        // Based on adminService.js, the structure is { statistics: { totalProducts: ... } }
        setTotalProductsCount(statistics.totalProducts);

        const topProductData = (statistics.topProducts && statistics.topProducts.length > 0)
                      ? statistics.topProducts[0] // Get the first object { productId, count, product: { ... } }
                      : null;
        const productName = (topProductData && topProductData.product && topProductData.product.name)
        ? topProductData.product.name // Access the name here
        : "N/A";

        setMostAddedProductName(productName);
      } catch (err) {
        console.error("Failed to fetch admin statistics:", err);
        setStatsError("Failed to load statistics."); // Set a user-friendly error message
        setTotalProductsCount(null); // Reset count on error
      } finally {
        setLoadingStats(false); // Finish loading regardless of success or error
      }
    };

    fetchAdminStats();
    // The dependency array includes adminStatistics to ensure effect runs if the function instance changes (though unlikely here)
  }, [adminStatistics]);


  const handleLogout = () => {
    logout();
  };

  // these will be handled by backend later
  // const totalProducts = products.length;
  // const mostAddedProduct = products[0]?.name || "N/A";
  // const highestRatedProduct = "Product X";


  // const mostAddedProduct = "N/A"; // Placeholder - could be statistics.topProducts[0]?.name || "N/A"
  const highestRatedProduct = "Product X"; // Placeholder - Backend doesn't provide this yet

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

        {/* Display error message if fetching stats failed */}
        {statsError && <p className={styles.error}>{statsError}</p>}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Products</h3>
            {/* Display the fetched total products count */}
            {/* Show loading state or the count, or N/A if error/null */}
            <p>
              {loadingStats
                ? "Loading..."
                : totalProductsCount !== null
                ? totalProductsCount
                : "N/A"}
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>Recent Added Products</h3>
            <p>X</p>
          </div>
          <div className={styles.statCard}>
            <h3>Most Added to Cart</h3>
            <p>{mostAddedProductName}</p>
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
