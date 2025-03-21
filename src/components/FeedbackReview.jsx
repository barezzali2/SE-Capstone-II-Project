import { useProduct } from "../contexts/ProductContext";
import styles from "./FeedbackReview.module.css";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { useState } from "react";

function FeedbackReview({ product }) {
  const { baseUrl } = useProduct();
  const imageUrl = `${baseUrl}${product.image}`;
    const [rating, setRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        // You can send this new rating to your backend
        // Example: fetch('/api/update-rating', { method: 'POST', body: JSON.stringify({ id: product.id, rating: newRating }) })
      };


  return (
    <div className={styles.feedbackReview}>
      <div className={styles.header}>
        <a href="/productlist" className={styles.backLink}>
          &larr; Back to Products Page
        </a>
      </div>
      <div className={styles.productInfo}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.productImage}
        />
        <h2>{product.name}</h2>
        <p className={styles.price}>{product.price}</p>
      </div>
      <div className={styles.productDetail}>
        <h3>Product Detail</h3>
        <p>
          {product.description}
        </p>
      </div>
      <div className={styles.nutritions}>
        <h3>Nutritions</h3>
      </div>
      <div className={styles.review}>
        <h3>Review</h3>
        <p className={styles.stars}>
            <StarRating
                defaultRating={rating} 
                onSetRating={handleRatingChange}
            />
        </p>
      </div>

      <div className={styles.comment}>
            <textarea name="commments" id="" placeholder="Write your comments" rows={6} cols={75.5}></textarea>
      </div>

      <button className={styles.submit}>Submit your Feedback</button>
    </div>
  );
}



FeedbackReview.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.number
  }).isRequired,
};



export default FeedbackReview;
