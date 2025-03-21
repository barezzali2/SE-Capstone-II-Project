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
    navigate("/review", {state: { product }});
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // You can send this new rating to your backend
    // Example: fetch('/api/update-rating', { method: 'POST', body: JSON.stringify({ id: product.id, rating: newRating }) })
  };

  const handleAddToCart = () => {
    if (window.confirm("Are you sure to add this item to your cart?")) {
      addToCart(product.id);
      onClose();
    }
  };

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
            <p className={styles.modalDescription}>{product.description}</p>
            <div className={styles.modalActions}>
              <div className={styles.star}>
              <StarRating
              defaultRating={rating} 
              readOnly={true}
              // onSetRating={handleRatingChange}
              />
              </div>
              <button className={styles.feedback} onClick={handleFeedbackClick}>
                Feedback
              </button>
              <button className={styles.addToCard} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

QuickView.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.number
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuickView;
