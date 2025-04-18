import PropTypes from "prop-types";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuickView from "../QuickView";
import styles from "../MapView.module.css";

export function ProductDisplay({
  products,
  position,
  visible,
  onClose,
  category,
}) {
  console.log("ProductDisplay rendered:", { products, visible, category });
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!visible) return null;

  // this is the fallback for empty products so that the map doesn't break
  const displayProducts =
    products && products.length > 0
      ? products
      : [
          {
            id: "demo1",
            name: "Sample Product 1",
            price: 9.99,
            image: "/images/placeholder.jpg",
          },
          {
            id: "demo2",
            name: "Sample Product 2",
            price: 12.99,
            image: "/images/placeholder.jpg",
          },
        ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    console.log("Selected product for quick view:", product);
  };

  return (
    <>
      {/* this is the popup that displays the products */}
      <Html position={position} distanceFactor={15} zIndexRange={[100, 0]}>
        <motion.div
          className={styles.productPopup}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.productPopupHeader}>
            <h3>
              {category.charAt(0).toUpperCase() + category.slice(1)} Products
            </h3>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>
          <div className={styles.productList}>
            {displayProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className={styles.productItem}
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={
                    product.image && product.image.startsWith("http")
                      ? product.image
                      : product.image || "/images/placeholder.jpg"
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
                <div className={styles.productItemInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productPrice}>${product.price}</p>
                </div>
                <button
                  className={styles.quickViewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  Quick View
                </button>
              </div>
            ))}
          </div>
          <Link
            to={`/products?category=${category}`}
            className={styles.viewMoreLink}
          >
            <FiShoppingBag /> View all products
          </Link>
        </motion.div>
      </Html>

      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

ProductDisplay.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
    })
  ),
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};
