import { memo } from "react";
import { useProduct } from "../contexts/ProductContext";
import styles from "./FeaturedList.module.css";
import Product from "./Product";

function FeaturedList() {
  const { products } = useProduct();

  // Filter only featured products
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );

  return (
    <div className={styles.recent}>
      <h3>Featured Products</h3>
      <div className={styles.productsGrid}>
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <p>No featured products available</p>
        )}
      </div>
    </div>
  );
}

export default memo(FeaturedList);
