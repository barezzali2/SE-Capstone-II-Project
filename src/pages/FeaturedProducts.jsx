import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import styles from "./FeaturedProducts.module.css";
import FeaturedProductsHero from "../components/featured/FeaturedProductsHero";
import FeaturedProductsFeatures from "../components/featured/FeaturedProductsFeatures";
import FeaturedProductsFilter from "../components/featured/FeaturedProductsFilter";
import FeaturedProductsList from "../components/featured/FeaturedProductsList";
import FeaturedProductsFooter from "../components/featured/FeaturedProductsFooter";
import FeaturedProductsLoading from "../components/featured/FeaturedProductsLoading";
import { useProduct } from "../contexts/ProductContext";
import ChatbotAssistant from "../components/ChatbotAssistant";
function FeaturedProducts() {
  const { loading } = useProduct();

  if (loading) {
    return <FeaturedProductsLoading />;
  }

  return (
    <motion.div
      className={styles.featuredProductsPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className={styles.backButton}>
        <FiHome /> Back to Home
      </Link>

      <FeaturedProductsHero />
      <FeaturedProductsFeatures />
      <FeaturedProductsFilter />
      <FeaturedProductsList />
      <FeaturedProductsFooter />
      <ChatbotAssistant />
    </motion.div>
  );
}

export default FeaturedProducts;
