import styles from "./ScannerView.module.css";
import CameraScanner from "./CameraScanner";
import ImageScanner from "./ImageScanner";
import { useState } from "react";
import { useProduct } from "../../contexts/ProductContext";
import axios from "axios";
import QuickView from "../QuickView";

function ScannerView() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannedProduct, setScannedProduct] = useState(null);
  const { baseUrl } = useProduct();

  const handleBarcodeDetected = async (barcode) => {
    setScanning(true);
    setError(null);

    try {
      const response = await axios.get(`${baseUrl}/product/barcode/${barcode}`);

      if (response.data.product) {
        setScannedProduct(response.data.product);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Product with barcode ${barcode} not found`);
      } else {
        setError("Failed to scan product. Please try again.");
      }
    } finally {
      setScanning(false);
    }
  };

  const handleFileSelect = async (barcode) => {
    handleBarcodeDetected(barcode);
  };

  const handleQuickViewClose = () => {
    setScannedProduct(null);
  };

  return (
    <div className={styles.scannerContainer}>
      <div className={styles.scannerOptions}>
        <h2>Scan Your Product</h2>
        <p>Choose how you&apos;d like to scan your product&apos;s barcode</p>

        {error && <div className={styles.error}>{error}</div>}

        {scanning && (
          <div className={styles.scanning}>
            <div className={styles.loadingSpinner}></div>
            <p>Scanning product...</p>
          </div>
        )}

        <div className={styles.optionsGrid}>
          <CameraScanner onBarcodeDetected={handleBarcodeDetected} />
          <ImageScanner onFileSelect={handleFileSelect} />
        </div>
      </div>

      {scannedProduct && (
        <QuickView product={scannedProduct} onClose={handleQuickViewClose} />
      )}
    </div>
  );
}

export default ScannerView;
