import { motion } from "framer-motion";
import MapIndicator from "../map/MapIndicator";
import styles from "./MapSection.module.css";

function MapSection() {
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
          Find Your Way <span>Easily</span>
        </h2>
        <p>Navigate through our store with our interactive map</p>
      </motion.div>
      <motion.div
        className={styles.mapContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <MapIndicator />
      </motion.div>
    </div>
  );
}

export default MapSection;
