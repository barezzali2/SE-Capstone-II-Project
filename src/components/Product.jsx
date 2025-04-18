import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import styles from "./Product.module.css";
import QuickView from "./QuickView";
import { useProduct } from "../contexts/ProductContext";

function Product({ product, listView = false }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { baseUrl } = useProduct();

  const calculateDiscountedPrice = (price) => {
    if (!product.isDiscounted || !product.discountRate) return price;

    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""));
    if (isNaN(numericPrice)) return price;

    const discountedPrice = numericPrice * (1 - product.discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  const handleCardClick = () => {
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className={`${styles.productCard} ${
          listView ? styles.listViewCard : ""
        }`}
        onClick={listView ? handleCardClick : undefined}
      >
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={product.name} />
          {!listView && (
            <div className={styles.overlay}>
              <button
                className={styles.quickView}
                onClick={() => setIsQuickViewOpen(true)}
              >
                Quick View
              </button>
            </div>
          )}
          {!listView && product.isDiscounted && product.discountRate > 0 && (
            <span className={styles.discountBadge}>
              -{product.discountRate}%
            </span>
          )}
          {!listView && product.isFeatured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
        <div className={styles.productInfo}>
          <h3>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>

          {/* list view badges for discount and featured */}
          {listView && (
            <div className={styles.listViewBadges}>
              {product.isDiscounted && product.discountRate > 0 && (
                <span className={styles.listDiscountBadge}>
                  -{product.discountRate}%
                </span>
              )}
              {product.isFeatured && (
                <span className={styles.listFeaturedBadge}>Featured</span>
              )}
            </div>
          )}

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
  listView: PropTypes.bool,
};

export default Product;
