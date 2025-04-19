import styles from "./CategoryLoading.module.css";

function CategoryLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Loading products...</p>
    </div>
  );
}

export default CategoryLoading;
