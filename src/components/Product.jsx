import { memo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Product.module.css";
import QuickView from "./QuickView";
import { useProduct } from "../contexts/ProductContext";

function Product({ product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { baseUrl } = useProduct();
  const imageUrl = `${baseUrl}${product.image}`;

  const calculateDiscountedPrice = (price) => {
    if (
      !product.isDiscounted ||
      !product.discountRate ||
      product.discountRate <= 0
    )
      return price;
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - product.discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  return (
    <>
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={product.name} />
          <div className={styles.overlay}>
            <button
              className={styles.quickView}
              onClick={() => setIsQuickViewOpen(true)}
            >
              Quick View
            </button>
          </div>
          {product.isDiscounted && product.discountRate > 0 && (
            <span className={styles.discountBadge}>
              -{product.discountRate}%
            </span>
          )}
          {product.isFeatured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
        <div className={styles.productInfo}>
          <h3>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>
          <div className={styles.priceContainer}>
            {product.isDiscounted && product.discountRate > 0 ? (
              <>
                <span className={styles.originalPrice}>{product.price}</span>
                <span className={styles.discountedPrice}>
                  {calculateDiscountedPrice(product.price)}
                </span>
              </>
            ) : (
              <p className={styles.price}>{product.price}</p>
            )}
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickView
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    isDiscounted: PropTypes.bool,
    discountRate: PropTypes.number,
    isFeatured: PropTypes.bool,
  }).isRequired,
};

export default memo(Product);
