import Navbar from "../components/Navbar";
import ScannerView from "../components/ScannerView";
import styles from "./Scanner.module.css";
import Footer from "../components/Footer";

function Scanner() {
  return (
    <div className={styles.scanner}>
      <Navbar />
      <ScannerView />
      <Footer />
    </div>
  );
}

export default Scanner;
