import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "./Review.module.css";
import FeedbackReview from "../components/FeedbackReview";
import { useLocation } from "react-router-dom";

function Review() {
  const location = useLocation();
  const product = location.state?.product;
  return (
    <div className={styles.review}>
      <Navbar />
      <FeedbackReview product={product}/>
      <Footer />
    </div>
  )
}

export default Review;