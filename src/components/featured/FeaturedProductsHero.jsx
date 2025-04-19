import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import styles from "./FeaturedProductsHero.module.css";

function FeaturedProductsHero() {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={styles.heroIcon}
        >
          <FiAward />
        </motion.div>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Featured Products
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Discover our handpicked selection of premium products
        </motion.p>
      </div>
    </div>
  );
}

export default FeaturedProductsHero;
