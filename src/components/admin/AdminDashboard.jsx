import { useAuth } from "../../contexts/AuthContext";
import { useProduct } from "../../contexts/ProductContext";
import Sidebar from "./Sidebar";
import styles from "./AdminDashboard.module.css";
import { useEffect, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import {
  FiPackage,
  FiClock,
  FiShoppingCart,
  FiStar,
  FiUsers,
  FiRepeat,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { adminStatistics, baseUrl } = useProduct();

  const [totalProductsCount, setTotalProductsCount] = useState(null);
  const [latestProduct, setLatestProduct] = useState(null);
  const [mostAddedProduct, setMostAddedProduct] = useState(null);
  const [highestRatedProduct, setHighestRatedProduct] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [topProductStats, setTopProductStats] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const statistics = await adminStatistics();
        setTotalProductsCount(statistics.totalProducts);
        setLatestProduct(statistics.latestProduct);

        const topProductData = statistics.topProducts?.[0] || null;
        setMostAddedProduct(topProductData?.product || null);
        setTopProductStats(topProductData || null);

        setHighestRatedProduct(statistics.highestRatedProducts?.[0] || null);
        setCategoryData(statistics.productsByCategory || []);
      } catch (err) {
        console.error("Failed to fetch admin statistics:", err);
        setStatsError("Failed to load statistics.");
        setTotalProductsCount(null);
        setLatestProduct(null);
        setMostAddedProduct(null);
        setTopProductStats(null);
        setHighestRatedProduct(null);
        setCategoryData(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAdminStats();
  }, [adminStatistics]);

  const categoryChartData = {
    labels: categoryData?.map((cat) => cat.category) || [],
    datasets: [
      {
        data: categoryData?.map((cat) => cat.count) || [],
        backgroundColor: [
          "#FF6384",
          "#F28C28",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    onClick,
    isClickable,
    image,
  }) => (
    <div
      className={`${styles.statCard} ${isClickable ? styles.clickable : ""}`}
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        <div className={styles.statIcon}>
          <Icon size={24} />
        </div>
        <div className={styles.statContent}>
          <h3>{title}</h3>
          <p>{loadingStats ? "Loading..." : value}</p>
        </div>
      </div>
      {image && (
        <div className={styles.statImage}>
          <img src={`${baseUrl}${image}`} alt={title} />
        </div>
      )}
    </div>
  );

  StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    isClickable: PropTypes.bool,
    image: PropTypes.string,
  };

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.adminHeader}>
          <h1>Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.name || "Admin"}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        {statsError && <p className={styles.error}>{statsError}</p>}

        <div className={styles.statsGrid}>
          <StatCard
            icon={FiPackage}
            title="Total Products"
            value={totalProductsCount || "N/A"}
          />

          <StatCard
            icon={FiClock}
            title="Recent Added"
            value={latestProduct?.name || "N/A"}
            onClick={() => latestProduct && setSelectedProduct(latestProduct)}
            isClickable={!!latestProduct}
            image={latestProduct?.image}
          />

          <div
            className={`${styles.statCard} ${styles.expandedCard} ${
              mostAddedProduct ? styles.clickable : ""
            }`}
            onClick={() =>
              mostAddedProduct && setSelectedProduct(mostAddedProduct)
            }
          >
            <div className={styles.cardContent}>
              <div className={styles.statIcon}>
                <FiShoppingCart size={24} />
              </div>
              <div className={styles.statContent}>
                <h3>Most Added to Cart</h3>
                {loadingStats ? (
                  <p>Loading...</p>
                ) : mostAddedProduct ? (
                  <div className={styles.statDetails}>
                    <p className={styles.productName}>
                      {mostAddedProduct.name}
                    </p>
                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <FiRepeat size={16} />
                        <span>
                          {topProductStats.totalAddedToCart} times added
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <FiUsers size={16} />
                        <span>
                          {topProductStats.uniqueCustomers} unique customers
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
            {mostAddedProduct?.image && (
              <div className={styles.statImage}>
                <img
                  src={`${baseUrl}${mostAddedProduct.image}`}
                  alt={mostAddedProduct.name}
                />
              </div>
            )}
          </div>

          <StatCard
            icon={FiStar}
            title="Highest Rated"
            value={
              highestRatedProduct
                ? `${highestRatedProduct.name} (${highestRatedProduct.rating}★)`
                : "N/A"
            }
            onClick={() =>
              highestRatedProduct && setSelectedProduct(highestRatedProduct)
            }
            isClickable={!!highestRatedProduct}
            image={highestRatedProduct?.image}
          />
        </div>

        <div className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h3>Products by Category</h3>
            <div className={styles.chartContainer}>
              {categoryData && categoryData.length > 0 ? (
                <Doughnut
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              ) : (
                <p>No category data available</p>
              )}
            </div>
          </div>
        </div>

        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
