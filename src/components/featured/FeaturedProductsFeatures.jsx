import { FiStar, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import styles from "./FeaturedProductsFeatures.module.css";

function FeaturedProductsFeatures() {
  return (
    <div className={styles.featuresBar}>
      <div className={styles.feature}>
        <FiStar />
        <span>Premium Quality</span>
      </div>
      <div className={styles.feature}>
        <FiShoppingBag />
        <span>Exclusive Selection</span>
      </div>
      <div className={styles.feature}>
        <FiTrendingUp />
        <span>Trending Items</span>
      </div>
    </div>
  );
}

export default FeaturedProductsFeatures;
