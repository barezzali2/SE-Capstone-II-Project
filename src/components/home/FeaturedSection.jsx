import { motion } from "framer-motion";
import FeaturedList from "../featured/FeaturedList";
import styles from "./FeaturedSection.module.css";

function FeaturedSection() {
  return (
    <motion.div
      className={styles.featuredWrapper}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <FeaturedList />
    </motion.div>
  );
}

export default FeaturedSection;
