import { motion } from "framer-motion";
import { FiShoppingBag, FiTag, FiTrendingUp, FiMapPin } from "react-icons/fi";
import styles from "./FeaturesBar.module.css";

function FeaturesBar() {
  return (
    <motion.div
      className={styles.featuresBar}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className={styles.feature}>
        <FiShoppingBag />
        <span>Premium Products</span>
      </div>
      <div className={styles.feature}>
        <FiTag />
        <span>Exclusive Discounts</span>
      </div>
      <div className={styles.feature}>
        <FiTrendingUp />
        <span>Trending Items</span>
      </div>
      <div className={styles.feature}>
        <FiMapPin />
        <span>Product Map</span>
      </div>
    </motion.div>
  );
}

export default FeaturesBar;
