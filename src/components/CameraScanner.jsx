import styles from "./CameraScanner.module.css";
import { FaCamera } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import PropTypes from "prop-types";

function CameraScanner({ onBarcodeDetected }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasCameraDevice, setHasCameraDevice] = useState(null);
  const html5QrCodeRef = useRef(null);
  const scannerInitializedRef = useRef(false);
  useEffect(() => {
    async function checkCameraAvailability() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasCameraDevice(videoDevices.length > 0);

        if (videoDevices.length === 0) {
          setError(
            "No camera detected on this device. Please use the image upload option."
          );
        }
      } catch (err) {
        console.error("Error checking camera availability:", err);
        setHasCameraDevice(false);
        setError(
          "Unable to detect camera. Please use the image upload option."
        );
      }
    }

    checkCameraAvailability();
  }, []);

  const startScanner = () => {
    setError(null);
    setIsScanning(true);
  };
  useEffect(() => {
    if (isScanning) {
      initScanner();
    }

    return () => {
      if (html5QrCodeRef.current && scannerInitializedRef.current) {
        html5QrCodeRef.current.stop().catch((err) => {
          console.error("Error stopping scanner:", err);
        });
      }
    };
  }, [isScanning]);

  const initScanner = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          console.log("Barcode detected:", decodedText);
          onBarcodeDetected(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      );

      scannerInitializedRef.current = true;
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError(
        "Camera access failed. Please check permissions or try another method."
      );
      setIsScanning(false);
      scannerInitializedRef.current = false;
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && scannerInitializedRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          console.log("Scanner stopped");
          scannerInitializedRef.current = false;
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        })
        .finally(() => {
          setIsScanning(false);
        });
    } else {
      setIsScanning(false);
    }
  };

  return (
    <div className={styles.scannerWrapper}>
      <button
        className={`${styles.optionButton} ${
          !hasCameraDevice ? styles.disabledButton : ""
        }`}
        onClick={isScanning ? stopScanner : startScanner}
        disabled={!hasCameraDevice || (error && !isScanning)}
      >
        <div className={styles.optionIcon}>
          <FaCamera />
        </div>
        <h3>Use Camera</h3>
        <p>
          {hasCameraDevice === false
            ? "No camera available on this device"
            : "Scan barcode using your device's camera"}
        </p>
      </button>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {isScanning && (
        <div className={styles.scannerOverlay}>
          <div id="qr-reader" className={styles.viewport} />
          <button className={styles.closeButton} onClick={stopScanner}>
            Close Scanner
          </button>
        </div>
      )}
    </div>
  );
}

CameraScanner.propTypes = {
  onBarcodeDetected: PropTypes.func.isRequired,
};

export default CameraScanner;
