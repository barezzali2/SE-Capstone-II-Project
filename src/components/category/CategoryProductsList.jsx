import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProduct } from "../../contexts/ProductContext";
import Product from "../Product";
import styles from "./CategoryProductsList.module.css";

function CategoryProductsList({ categoryName }) {
  const { products } = useProduct();
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === categoryName.toLowerCase()
      );
      setCategoryProducts(filtered);
    }
  }, [products, categoryName]);

  if (categoryProducts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No products found</h2>
        <p>We couldn&apos;t find any products in this category.</p>
        <Link to="/productlist" className={styles.browseButton}>
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.productsGrid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {categoryProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <Product product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

CategoryProductsList.propTypes = {
  categoryName: PropTypes.string.isRequired,
};

export default CategoryProductsList;
