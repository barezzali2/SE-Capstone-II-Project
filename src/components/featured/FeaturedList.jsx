import { memo } from "react";
import { useProduct } from "../../contexts/ProductContext";
import styles from "./FeaturedList.module.css";
import Product from "../Product";
import { FiAward, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function FeaturedList() {
  const { products } = useProduct();

  const featuredProducts = products
    .filter((product) => product.isFeatured === true)
    .slice(0, 4); // this is the limit of the featured products

  return (
    <div className={styles.featuredSection}>
      <div className={styles.featuredHeader}>
        <div className={styles.titleContainer}>
          <FiAward className={styles.awardIcon} />
          <h2>Featured Products</h2>
        </div>
        <p className={styles.subtitle}>
          Handpicked selections that stand out from the rest
        </p>
        <Link to="/products/featured" className={styles.viewAllLink}>
          View All Featured Products <FiArrowRight />
        </Link>
      </div>

      <div className={styles.productsGrid}>
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <p className={styles.noProducts}>No featured products available</p>
        )}
      </div>
    </div>
  );
}

export default memo(FeaturedList);
