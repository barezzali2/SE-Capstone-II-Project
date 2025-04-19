import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import styles from "./CategoryPage.module.css";
import CategoryHeader from "../components/category/CategoryHeader";
import CategoryProductsList from "../components/category/CategoryProductsList";
import CategoryLoading from "../components/category/CategoryLoading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useProduct } from "../contexts/ProductContext";
import { useParams } from "react-router-dom";

function CategoryPage() {
  const { categoryName } = useParams();
  const { loading } = useProduct();

  if (loading) {
    return (
      <>
        <Navbar />
        <CategoryLoading />
        <Footer />
      </>
    );
  }

  return (
    <motion.div
      className={styles.categoryPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className={styles.categoryContainer}>
        <Link to="/productlist" className={styles.backButton}>
          <FiArrowLeft />
          Back to All Products
        </Link>

        <CategoryHeader categoryName={categoryName} />
        <CategoryProductsList categoryName={categoryName} />
      </div>

      <Footer />
    </motion.div>
  );
}

export default CategoryPage;
