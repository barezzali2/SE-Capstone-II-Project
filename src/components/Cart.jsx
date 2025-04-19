import styles from "./Cart.module.css";
import PropTypes from "prop-types";
import { useProduct } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiTag,
  FiMinus,
  FiPlus,
  FiEye,
  FiTrash,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import QuickView from "./QuickView";

function Cart({ product }) {
  const { baseUrl } = useProduct();
  const { removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const imageUrl = `${baseUrl}${product.image}`;
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    // this will update the quantity if it changes from props
    if (product.quantity && product.quantity !== quantity) {
      setQuantity(product.quantity);
    }
  }, [product.quantity, quantity]);

  const calculateDiscountedPrice = (price) => {
    if (!product.isDiscounted || !product.discountRate) return price;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) return price;
    const discountedPrice = numericPrice * (1 - product.discountRate / 100);
    return `${Math.round(discountedPrice)} IQD`;
  };

  const calculateSavings = (price) => {
    if (!product.isDiscounted || !product.discountRate) return 0;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) return 0;
    return Math.round(numericPrice * (product.discountRate / 100));
  };

  const calculateItemTotal = () => {
    const basePrice =
      product.isDiscounted && product.discountRate > 0
        ? parseFloat(
            calculateDiscountedPrice(product.price).replace(/[^0-9.]/g, "")
          )
        : parseFloat(product.price.replace(/[^0-9.]/g, ""));

    return `${Math.round(basePrice * quantity)} IQD`;
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure to delete this item in your cart?")) {
      removeFromCart(product.id);
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItemQuantity(product.id, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItemQuantity(product.id, newQuantity);
    }
  };

  const handleViewMore = () => {
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <>
      <motion.div
        className={styles.cart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={product.name} />
          {product.isDiscounted && product.discountRate > 0 && (
            <div className={styles.discountBadge}>
              <FiTag className={styles.discountIcon} />
              <span>{product.discountRate}%</span>
            </div>
          )}
        </div>

        <div className={styles.productInfo}>
          <h4>{product.name}</h4>
          <div className={styles.categoryBadge}>
            <span>{product.category}</span>
          </div>

          <div className={styles.priceContainer}>
            {product.isDiscounted && product.discountRate > 0 ? (
              <div className={styles.priceWrapper}>
                <span className={styles.originalPrice}>{product.price}</span>
                <span className={styles.discountedPrice}>
                  {calculateDiscountedPrice(product.price)}
                </span>
                <div className={styles.savingsBadge}>
                  Save {calculateSavings(product.price)} IQD
                </div>
              </div>
            ) : (
              <p className={styles.price}>{product.price}</p>
            )}

            {quantity > 1 && (
              <div className={styles.itemTotalPrice}>
                Total: {calculateItemTotal()}
              </div>
            )}
          </div>

          <div className={styles.descriptionContainer}>
            <p className={styles.desc}>{product.description}</p>
            <button
              className={styles.descriptionExpand}
              onClick={handleViewMore}
            >
              <FiEye size={14} /> View more
            </button>
          </div>

          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <FiMinus size={14} />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={handleIncreaseQuantity}
            >
              <FiPlus size={14} />
            </button>
          </div>
        </div>

        <motion.button
          className={styles.removeCart}
          onClick={handleRemove}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(221, 88, 55, 0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FiTrash2 className={styles.trashIcon} />
        </motion.button>
      </motion.div>

      {showQuickView && (
        <QuickView product={product} onClose={closeQuickView} />
      )}
    </>
  );
}

Cart.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isDiscounted: PropTypes.bool,
    discountRate: PropTypes.number,
    isFeatured: PropTypes.bool,
    quantity: PropTypes.number,
  }).isRequired,
};

export default Cart;
