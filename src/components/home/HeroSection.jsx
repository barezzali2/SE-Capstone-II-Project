import { motion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <motion.div
      className={styles.heroSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.heroContent}>
        <motion.div
          className={styles.leftQuote}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1>
            <span className={styles.line}>
              <span className={styles.save}>Save</span> Time.
            </span>
            <span className={styles.line}>
              Shop <span className={styles.smart}>Smart</span>.
            </span>
            <span className={styles.line}>
              <span className={styles.stress}>Stress</span> Less.
            </span>
          </h1>
          <motion.div
            className={styles.ctaButton}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link to="/productlist">Start Shopping</Link>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.greetingBanner}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className={styles.brandContainer}>
            <p>Hello! This is</p>
            <h2 className={styles.fullBrandName}>
              Retail<span>Xplore</span> 🛍️
            </h2>
          </div>
          <h4>Explore and make your shopping easier with us!</h4>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
      >
        <FiArrowDown />
        <span>Scroll to explore</span>
      </motion.div>
    </motion.div>
  );
}

export default HeroSection;
