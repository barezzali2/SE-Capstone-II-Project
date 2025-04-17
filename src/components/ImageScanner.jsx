import styles from "./ImageScanner.module.css";
import { FaImage } from "react-icons/fa";
import PropTypes from "prop-types";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";

function ImageScanner({ onFileSelect }) {
  const [scanning, setScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const COOLDOWN_PERIOD = 3000; // 3 seconds cooldown

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const now = Date.now();
    if (now - lastScanTime < COOLDOWN_PERIOD) {
      alert("Please wait a few seconds before scanning again.");
      return;
    }

    setScanning(true);
    setLastScanTime(now);
    const html5QrCode = new Html5Qrcode("reader");

    // Add configuration for better scanning
    const config = {
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      formatsToSupport: ["EAN_13", "EAN_8", "CODE_128"], // Add formats you need
    };

    html5QrCode
      .scanFile(file, true, config)
      .then((decodedText) => {
        console.log("Barcode found:", decodedText);
        // Add delay before making the API call
        setTimeout(() => {
          // Ensure we're getting the full product data with discount and featured info
          const productData = {
            barcode: decodedText,
            includeDiscounts: true, // Add this flag to tell backend to include discount info
            includeFeatured: true, // Add this flag to tell backend to include featured status
          };
          onFileSelect(decodedText, productData);
        }, 2000);
        setScanning(false);
      })
      .catch((error) => {
        if (error.response?.status === 429) {
          alert("Please wait a moment before scanning again.");
        } else {
          console.error("Detailed error:", error);
          alert(
            "No barcode found or unreadable. Please ensure the image is clear and contains a valid barcode."
          );
        }
        setScanning(false);
      })
      .finally(() => {
        html5QrCode.clear();
      });
  };

  return (
    <div>
      <label className={styles.optionButton}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className={styles.fileInput}
          disabled={scanning}
        />
        <div className={styles.optionIcon}>
          <FaImage />
        </div>
        <h3>Upload Image</h3>
        <p>{scanning ? "Processing..." : "Upload an image of your barcode"}</p>
      </label>

      {/* this is the hidden element needed for the html5-qrcode library */}
      <div id="reader" style={{ display: "none" }}></div>
    </div>
  );
}

ImageScanner.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};

export default ImageScanner;
