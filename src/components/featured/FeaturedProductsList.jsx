import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { useProduct } from "../../contexts/ProductContext";
import Product from "../Product";
import styles from "./FeaturedProductsList.module.css";

function FeaturedProductsList() {
  const { products } = useProduct();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (products && products.length > 0) {
      const featured = products.filter(
        (product) => product.isFeatured === true
      );
      setFeaturedProducts(featured);
      setFilteredProducts(featured);
    }
  }, [products]);

  useEffect(() => {
    // Listen for filter changes from the FeaturedProductsFilter component
    const handleFilterChange = (event) => {
      const { category } = event.detail;
      setActiveFilter(category);
    };

    window.addEventListener("filterChange", handleFilterChange);
    return () => {
      window.removeEventListener("filterChange", handleFilterChange);
    };
  }, []);

  useEffect(() => {
    // Filter products based on active filter
    const filtered =
      activeFilter === "all"
        ? featuredProducts
        : featuredProducts.filter(
            (product) => product.category === activeFilter
          );
    setFilteredProducts(filtered);
  }, [activeFilter, featuredProducts]);

  if (filteredProducts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.emptyStateIcon}
        >
          <FiShoppingBag />
        </motion.div>
        <h2>No featured products available</h2>
        <p>Please check back later for our featured selections.</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.productsGrid}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <Product product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default FeaturedProductsList;
