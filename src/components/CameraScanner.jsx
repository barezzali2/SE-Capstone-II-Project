import styles from "./CameraScanner.module.css";
import { FaCamera } from "react-icons/fa";

function CameraScanner() {
  return (
    <button className={styles.optionButton}>
      <div className={styles.optionIcon}>
        <FaCamera />
      </div>
      <h3>Use Camera</h3>
      <p>Scan barcode using your device&apos;s camera</p>
    </button>
  );
}

export default CameraScanner;
