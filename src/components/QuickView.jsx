import PropTypes from "prop-types";
import styles from "./QuickView.module.css";

function QuickView({ product, onClose }) {
  const imageUrl = `http://localhost:3003${product.image}`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.modalContent}>
          <div className={styles.modalImage}>
            <img src={imageUrl} alt={product.name} />
          </div>
          <div className={styles.modalInfo}>
            <h2>{product.name}</h2>
            <p className={styles.modalCategory}>{product.category}</p>
            <p className={styles.modalPrice}>{product.price}</p>
            <p className={styles.modalDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.addToCard}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

QuickView.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuickView;
