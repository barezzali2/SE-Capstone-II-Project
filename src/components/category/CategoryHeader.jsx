import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import { motion } from "framer-motion";
import styles from "./CategoryHeader.module.css";

function CategoryHeader({ categoryName }) {
  return (
    <motion.div
      className={styles.categoryHeader}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link to="/productlist" className={styles.breadcrumbLink}>
          Products
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.currentPage}>{categoryName}</span>
      </div>

      <h1 className={styles.categoryTitle}>
        <FiGrid className={styles.categoryIcon} />
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h1>

      <p className={styles.categoryDescription}>
        Explore our selection of high-quality {categoryName.toLowerCase()}{" "}
        products
      </p>
    </motion.div>
  );
}

CategoryHeader.propTypes = {
  categoryName: PropTypes.string.isRequired,
};

export default CategoryHeader;
