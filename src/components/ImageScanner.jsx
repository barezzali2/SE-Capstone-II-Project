import styles from "./ImageScanner.module.css";
import { FaImage } from "react-icons/fa";
import PropTypes from "prop-types";
import { Html5Qrcode } from "html5-qrcode";
import { useState } from "react";

function ImageScanner({ onFileSelect }) {
  const [scanning, setScanning] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setScanning(true);
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => {
        console.log("Barcode found:", decodedText);
        onFileSelect(decodedText);
        setScanning(false);
      })
      .catch((error) => {
        console.error("Error scanning barcode:", error);
        alert("No barcode found. Please try another image.");
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
