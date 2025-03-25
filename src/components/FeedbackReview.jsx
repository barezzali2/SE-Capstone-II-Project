import { useProduct } from "../contexts/ProductContext";
import styles from "./FeedbackReview.module.css";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";

function FeedbackReview({ product }) {
  const { baseUrl } = useProduct();
  const imageUrl = `${baseUrl}${product.image}`;
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");


  useEffect(() => {
    fetch(`${baseUrl}/api/reviews?productId=${product.id}`)
        .then(response => response.json())
        .then(data => setReviews(data.reviews))
        .catch(error => console.error("Error fetching reviews:", error));
}, [baseUrl, product.id]);


// Problem with displaying 0 review rating - - check it later
const handleSubmitReview = () => {
  const newReview = { productId: product.id, rating, comment };

  fetch(`${baseUrl}/api/reviews/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReview),
  })
  .then(response => response.json())
  .then(() => {
    setReviews(prevReviews => [...prevReviews, newReview]); // Correctly update reviews based on the previous state
    setRating(0);
    setComment("");
  })
  .catch(error => console.error("Error submitting review:", error));
};





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
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              name="commments" 
              id="" 
              placeholder="Write your comments" 
              rows={6} 
              cols={75.5} />
      </div>

      <button className={styles.submit} onClick={handleSubmitReview}>Submit your Feedback</button>


      <div className={styles.reviewList}>
        <h3>Customer Reviews</h3>
        {reviews.length > 0 ? (
            reviews.map((rev) => (
                <div key={rev.id} className={styles.singleReview}>
                    <p className={styles.anonymous}>Anonymous User</p>
                    <StarRating value={rev.rating} readOnly={true} />
                    <p>{rev.comment}</p>
                </div>
            ))
        ) : (
            <p>No reviews yet. Be the first to review!</p>
        )}
    </div>

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
