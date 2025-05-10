import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiDownload, FiX, FiSmartphone } from "react-icons/fi";
import { createPortal } from "react-dom";
import styles from "./CartListQR.module.css";
import { useProduct } from "../../contexts/ProductContext";

function CartListQR({ cartItems, isMobile }) {
  const { baseUrl } = useProduct();
  const [pdfUrl, setPdfUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      const simplifiedItems = cartItems.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
        image: item.product.image.startsWith("http")
          ? item.product.image
          : `${baseUrl}${item.product.image}`,
        isDiscounted: item.product.isDiscounted,
        discountRate: item.product.discountRate,
      }));

      setPdfUrl(
        `${baseUrl}/api/cart/download-pdf?items=${encodeURIComponent(
          JSON.stringify(simplifiedItems)
        )}`
      );
    }
  }, [cartItems, baseUrl]);

  return (
    <>
      {!isMobile ? (
        <button
          onClick={() => setShowModal(true)}
          className={styles.downloadButton}
        >
          <FiDownload /> Download Cart List
        </button>
      ) : (
        <a
          href={pdfUrl}
          download="shopping-list.pdf"
          className={styles.downloadButton}
        >
          <FiDownload /> Download Cart List
        </a>
      )}

      {showModal &&
        createPortal(
          <div className={styles.modalPortal}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
              <div className={styles.qrWrapper}>
                <QRCodeSVG
                  value={pdfUrl}
                  size={400}
                  level="L"
                  includeMargin={true}
                />
              </div>
              <div className={styles.scanInstructions}>
                <FiSmartphone className={styles.phoneIcon} />
                <p className={styles.qrText}>
                  <span className={styles.scanHighlight}>SCAN</span> with your
                  phone to download
                </p>
              </div>
            </div>
            <div
              className={styles.modalBackdrop}
              onClick={() => setShowModal(false)}
            />
          </div>,
          document.body
        )}
    </>
  );
}

CartListQR.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default CartListQR;
