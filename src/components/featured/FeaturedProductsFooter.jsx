import styles from "./FeaturedProductsFooter.module.css";

function FeaturedProductsFooter() {
  return (
    <div className={styles.featuredFooter}>
      <div className={styles.footerContent}>
        <h3>Why Choose Our Featured Products?</h3>
        <p>
          Our featured products are carefully selected for their exceptional
          quality, design, and value. Each item has been personally evaluated by
          our team to ensure it meets our high standards.
        </p>
      </div>
    </div>
  );
}

export default FeaturedProductsFooter;
