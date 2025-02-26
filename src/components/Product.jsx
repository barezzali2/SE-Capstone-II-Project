import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Product.module.css";
import QuickView from "./QuickView";

function Product({ product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} />
          <div className={styles.overlay}>
            <button
              className={styles.quickView}
              onClick={() => setIsQuickViewOpen(true)}
            >
              Quick View
            </button>
          </div>
        </div>
        <div className={styles.productInfo}>
          <h3>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>{product.price}</p>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickView
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default Product;
