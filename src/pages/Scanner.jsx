import Navbar from "../components/Navbar";
import ScannerView from "../components/ScannerView";
import styles from "./Scanner.module.css";

function Scanner() {
  return (
    <div className={styles.scanner}>
      <Navbar />
      <ScannerView />
    </div>
  );
}

export default Scanner;
