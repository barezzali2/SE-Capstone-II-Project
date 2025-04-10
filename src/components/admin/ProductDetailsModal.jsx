import { FiX } from "react-icons/fi";
import PropTypes from "prop-types";
import styles from "./ProductDetailsModal.module.css";
import { useProduct } from "../../contexts/ProductContext";

function ProductDetailsModal({ product, onClose }) {
  const { baseUrl } = useProduct();

  if (!product) return null;

  const calculateDiscountedPrice = (price) => {
    if (!product.isDiscounted || !product.discountRate) return price;

    // ("2500 IQD" -> 2500)
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""));
    if (isNaN(numericPrice)) return price;

    const discountedPrice = numericPrice * (1 - product.discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>

        <div className={styles.productImage}>
          <img
            src={`${baseUrl}${product.image}`}
            alt={product.name}
            // if the image is not found, show a placeholder image
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg"; 
              e.target.onerror = null; 
            }}
          />
          {product.isDiscounted && (
            <span className={styles.discountBadge}>
              -{product.discountRate}%
            </span>
          )}
        </div>

        <div className={styles.productInfo}>
          <h2>{product.name}</h2>
          <p className={styles.category}>{product.category}</p>

          <div className={styles.priceSection}>
            {product.isDiscounted ? (
              <>
                <span className={styles.originalPrice}>{product.price}</span>
                <span className={styles.discountedPrice}>
                  {calculateDiscountedPrice(product.price)}
                </span>
              </>
            ) : (
              <span className={styles.price}>{product.price}</span>
            )}
          </div>

          {product.rating && (
            <div className={styles.rating}>
              <span className={styles.stars}>
                {"★".repeat(Math.round(product.rating))}
              </span>
              <span className={styles.ratingNumber}>
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          <p className={styles.description}>
            {product.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}

ProductDetailsModal.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    rating: PropTypes.number,
    description: PropTypes.string,
    isDiscounted: PropTypes.bool,
    discountRate: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductDetailsModal;
