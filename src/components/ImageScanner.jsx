import styles from "./ImageScanner.module.css";
import { FaImage } from "react-icons/fa";
import PropTypes from "prop-types";

function ImageScanner({ onFileSelect }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <label className={styles.optionButton}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className={styles.fileInput}
      />
      <div className={styles.optionIcon}>
        <FaImage />
      </div>
      <h3>Upload Image</h3>
      <p>Upload an image of your barcode</p>
    </label>
  );
}

ImageScanner.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};

export default ImageScanner;
