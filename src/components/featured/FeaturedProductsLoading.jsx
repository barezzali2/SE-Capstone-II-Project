import styles from "./FeaturedProductsLoading.module.css";

function FeaturedProductsLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading featured products...</p>
    </div>
  );
}

export default FeaturedProductsLoading;
