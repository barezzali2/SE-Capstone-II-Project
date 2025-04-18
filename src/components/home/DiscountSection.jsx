import { motion } from "framer-motion";
import Discount from "../Discount";
import styles from "./DiscountSection.module.css";

function DiscountSection() {
  return (
    <div className={styles.sectionWrapper}>
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>
          Special <span>Offers</span>
        </h2>
        <p>Don&apos;t miss out on these limited-time deals</p>
      </motion.div>
      <motion.div
        className={styles.discountContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Discount />
      </motion.div>
    </div>
  );
}

export default DiscountSection;
