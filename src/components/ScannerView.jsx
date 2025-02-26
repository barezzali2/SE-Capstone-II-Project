import styles from "./ScannerView.module.css";
import CameraScanner from "./CameraScanner";
import ImageScanner from "./ImageScanner";

function ScannerView() {
  const handleFileSelect = (file) => {
    // This would eventually handle image upload and processing
    console.log("File selected:", file);
  };

  return (
    <div className={styles.scannerContainer}>
      <div className={styles.scannerOptions}>
        <h2>Scan Your Product</h2>
        <p>Choose how you&apos;d like to scan your product&apos;s barcode</p>

        <div className={styles.optionsGrid}>
          <CameraScanner />
          <ImageScanner onFileSelect={handleFileSelect} />
        </div>
      </div>
    </div>
  );
}

export default ScannerView;
