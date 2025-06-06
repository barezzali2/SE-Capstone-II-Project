import { FiX, FiMapPin, FiShoppingCart, FiMessageCircle } from "react-icons/fi";
import styles from "./QuickView.module.css";
import PropTypes from "prop-types";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog";

function QuickView({ product, onClose, onFindInStore }) {
  const { baseUrl } = useProduct();
  const { addToCart } = useCart();
  const imageUrl = `${baseUrl}${product.image}`;
  const [rating, setRating] = useState(product.rating || 0);
  const [topFeedbacks, setTopFeedbacks] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for dialog visibility
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Fetch top 3 feedbacks and average rating for the product
    const fetchFeedbacksAndRating = async () => {
      try {
        const [feedbackResponse, ratingResponse] = await Promise.all([
          axios.get(
            `${baseUrl}/api/reviews/top?productId=${product.id}&limit=3`
          ),
          axios.get(`${baseUrl}/api/reviews/average?productId=${product.id}`),
        ]);

        console.log("Top feedbacks:", feedbackResponse.data.reviews);
        setTopFeedbacks(feedbackResponse.data.reviews);

        console.log("Average rating:", ratingResponse.data.averageRating);
        setRating(ratingResponse.data.averageRating);
      } catch (error) {
        console.error("Error fetching feedbacks or average rating:", error);
      }
    };

    fetchFeedbacksAndRating();
  }, [baseUrl, product.id]);

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
    setShowConfirmation(true);
    // if (window.confirm("Are you sure to add this item to your cart?")) {
    //   addToCart(product._id || product.id);
    //   onClose();
    // }
  };

  const handleConfirmAddToCart = () => {
    addToCart(product._id || product.id);
    setShowConfirmation(false); // Hide the dialog
    setShowNotification(true); // Show the notification

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);

    // onClose();
  };

  const handleCancelAddToCart = () => {
    setShowConfirmation(false); // Hide the dialog
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
        {showNotification && (
          <div className={styles.notification}>
            Product added to cart successfully!
          </div>
        )}

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

          {/*  */}
          <div className={styles.topFeedbacks}>
            <h3>Top Feedbacks</h3>
            {topFeedbacks.length > 0 ? (
              topFeedbacks.map((feedback) => (
                <div key={feedback.id} className={styles.feedbackItem}>
                  <p className={styles.feedbackRating}>
                    Rating: {feedback.rating} ★
                  </p>
                  <p className={styles.feedbackComment}>
                    {`"${feedback.comment}"`}
                  </p>
                  <p className={styles.feedbackDate}>
                    {feedback.createdAt
                      ? new Date(feedback.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "No date available"}
                  </p>
                </div>
              ))
            ) : (
              <p>No feedbacks available yet.</p>
            )}
          </div>
        </div>
        <div className={styles.modalActions}>
          <div className={styles.star}>
            <StarRating
              value={rating}
              onRatingChange={handleRatingChange}
              readOnly={true}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.addToCard} onClick={handleAddToCart}>
              <FiShoppingCart className={styles.buttonIcon} />
              Add to Cart
            </button>
            <button
              className={styles.locationButton}
              onClick={() => onFindInStore(product)}
            >
              <FiMapPin className={styles.buttonIcon} />
              Find in Store
            </button>
            <button className={styles.feedback} onClick={handleFeedbackClick}>
              <FiMessageCircle className={styles.buttonIcon} />
              Feedback
            </button>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to add this item to your cart?"
          onConfirm={handleConfirmAddToCart}
          onCancel={handleCancelAddToCart}
        />
      )}
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
  onFindInStore: PropTypes.func.isRequired,
};

export default QuickView;
