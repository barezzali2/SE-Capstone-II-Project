import { useProduct } from "../contexts/ProductContext";
import styles from "./FeedbackReview.module.css";
import { FiArrowLeft} from "react-icons/fi";
import PropTypes from "prop-types";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";
import axios from "axios";

function FeedbackReview({ product }) {
  const { baseUrl } = useProduct();
  const imageUrl = `${baseUrl}${product.image}`;
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");


  useEffect(() => {
    axios.get(`${baseUrl}/api/reviews?productId=${product.id}`)
    .then(response => setReviews(response.data.reviews))
    .catch(error => console.error("Error fetching reviews:", error));
}, [baseUrl, product.id]);

//   useEffect(() => {
//     fetch(`${baseUrl}/api/reviews?productId=${product.id}`)
//         .then(response => response.json())
//         .then(data => setReviews(data.reviews))
//         .catch(error => console.error("Error fetching reviews:", error));
// }, [baseUrl, product.id]);


// Problem with displaying 0 review rating - - check it later
const handleSubmitReview = () => {
  console.log("Submitting rating:", rating); // Debugging step

  const newReview = { productId: product.id, rating, comment };

  fetch(`${baseUrl}/api/reviews/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReview),
  })
  .then(response => response.json())
  .then((data) => {
    console.log("Review submitted successfully:", data);

    // Ensure the rating is correctly included in the new review list
    setReviews(prevReviews => [...prevReviews, { ...newReview, id: data.id }]); 

    setRating(0); // Reset rating input for the next review
    setComment(""); // Reset comment input
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
          <FiArrowLeft /> <span>Back to Products Page</span>
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
                key={rating}
                defaultRating={rating} 
                onSetRating={handleRatingChange}
            />
        </p>
      </div>

      <div className={styles.commentArea}>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              name="commments" 
              id="" 
              placeholder="Write your comments" 
              rows={6}
              
               />
      </div>

      <button className={styles.submit} onClick={handleSubmitReview}>Submit your Feedback</button>


      <h2 className={styles.cusReview}>Customer Reviews</h2>
      <div className={styles.reviewList}>
        {/* <br /> */}
        {reviews.length > 0 ? (
            reviews.map((rev) => (
                <div key={rev.id} className={styles.singleReview}>
                    <p className={styles.anonymous}>Customer Feedback:</p>
                    <StarRating 
                    value={rev.rating} 
                    readOnly={true} />
                    <p className={styles.comment}>{`"${rev.comment}"`}</p>
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
