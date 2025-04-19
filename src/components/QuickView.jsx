import { FiX } from "react-icons/fi";
import PropTypes from "prop-types";
import styles from "./QuickView.module.css";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import StarRating from "./StarRating";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuickView({ product, onClose }) {
  const { baseUrl } = useProduct();
  const { addToCart } = useCart();
  const imageUrl = `${baseUrl}${product.image}`;
  const [rating, setRating] = useState(product.rating || 0);

  const navigate = useNavigate();
  const handleFeedbackClick = () => {
    navigate("/review", { state: { product } });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // You can send this new rating to your backend
    // Example: fetch('/api/update-rating', { method: 'POST', body: JSON.stringify({ id: product.id, rating: newRating }) })
  };

  const handleAddToCart = () => {
    if (window.confirm("Are you sure to add this item to your cart?")) {
      addToCart(product._id || product.id);
      onClose();
    }
  };

  const calculateDiscountedPrice = (price) => {
    if (
      !product.isDiscounted ||
      !product.discountRate ||
      product.discountRate <= 0
    )
      return price;
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
          <img src={imageUrl} alt={product.name} />
          {product.isDiscounted && product.discountRate > 0 && (
            <span className={styles.discountBadge}>
              -{product.discountRate}%
            </span>
          )}
          {product.isFeatured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
        <div className={styles.productInfo}>
          <h2>{product.name}</h2>
          <p className={styles.category}>{product.category}</p>
          <div className={styles.priceContainer}>
            {product.isDiscounted && product.discountRate > 0 ? (
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
          <p className={styles.description}>{product.description}</p>
        </div>
        <div className={styles.modalActions}>
          <div className={styles.star}>
            <StarRating rating={rating} onRatingChange={handleRatingChange} readOnly={true}/>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.addToCard} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className={styles.feedback} onClick={handleFeedbackClick}>
              Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

QuickView.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    isDiscounted: PropTypes.bool,
    discountRate: PropTypes.number,
    isFeatured: PropTypes.bool,
    rating: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuickView;
