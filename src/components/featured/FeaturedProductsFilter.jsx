import { useState, useEffect } from "react";
import { useProduct } from "../../contexts/ProductContext";
import styles from "./FeaturedProductsFilter.module.css";

function FeaturedProductsFilter() {
  const { products } = useProduct();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (products && products.length > 0) {
      const featured = products.filter(
        (product) => product.isFeatured === true
      );
      setFeaturedProducts(featured);
    }
  }, [products]);

  // Get unique categories from featured products
  const categories = [
    "all",
    ...new Set(featuredProducts.map((product) => product.category)),
  ];

  const filterProducts = (category) => {
    setActiveFilter(category);
    // Use a custom event to communicate with the FeaturedProductsList component
    window.dispatchEvent(
      new CustomEvent("filterChange", { detail: { category } })
    );
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className={styles.filterContainer}>
      <h3>Browse by Category</h3>
      <div className={styles.filterButtons}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${
              activeFilter === category ? styles.active : ""
            }`}
            onClick={() => filterProducts(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProductsFilter;
